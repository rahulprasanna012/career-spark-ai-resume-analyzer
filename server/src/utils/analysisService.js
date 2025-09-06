import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const MAX_CHARS = Number(process.env.GEMINI_MAX_CHARS || 24000);
const MOCK = process.env.MOCK_GEMINI === 'true';

const STRUCT_PROMPT = (resumeText) => `
You are an expert technical recruiter + ATS. Analyze the resume and return ONLY valid JSON.
Do not include any text before/after the JSON.

Resume:
"""
${resumeText}
"""

Return JSON exactly in this shape:
{
  "name": "string|null",
  "email": "string|null",
  "phone": "string|null",
  "linkedin_url": "string|null",
  "portfolio_url": "string|null",
  "summary": "string|null",

  "work_experience": [{"role":"string","company":"string","duration":"string","description":["string"]}],
  "education": [{"degree":"string","institution":"string","graduation_year":"string"}],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": [{"title":"string","tech":["string"],"summary":"string"}],
  "certifications": ["string"],

  "feedback_summary": {
    "strengths": ["bullet", "bullet"],
    "areas_to_improve": ["bullet", "bullet"],
    "suggested_skills": ["skill", "skill"],
    "overall_rating": 0,
    "ats_score": 0
  }
}
Rules:
- "overall_rating" is 1-10 integer.
- "ats_score" is 0-100 integer (based on clarity, keywords, contact info, structure).
`;

function parseJsonFromText(raw) {
  const s = raw.indexOf('{'); const e = raw.lastIndexOf('}');
  const txt = s >= 0 && e > s ? raw.slice(s, e + 1) : '{}';
  try { return JSON.parse(txt); } catch { return {}; }
}

// Simple ATS fallback if model omits it
function heuristicATS(data) {
  let score = 50;
  const hasContact = (data.email || data.phone || data.linkedin_url) ? 1 : 0;
  const skills = (data.technical_skills || []).length;
  const exp = (data.work_experience || []).length;
  const edu = (data.education || []).length;

  score += hasContact ? 10 : -10;
  score += Math.min(20, skills * 2);
  score += Math.min(15, exp * 3);
  score += Math.min(5, edu * 2);
  // Penalize long empty summary
  if (!data.summary) score -= 5;

  return Math.max(0, Math.min(100, score));
}

// Fallback strengths if missing
function heuristicStrengths(data) {
  const out = [];
  if ((data.technical_skills || []).length >= 5) out.push('Good breadth of technical skills');
  if ((data.work_experience || []).length >= 2) out.push('Solid experience history');
  if (data.linkedin_url) out.push('Public professional profile provided');
  if (data.projects?.length) out.push('Hands-on project experience');
  if (!out.length) out.push('Clear formatting and basic information present');
  return out;
}

function normalize(d = {}) {
  const fb = d.feedback_summary || {};
  const overall = Number(fb.overall_rating ?? d.resume_rating ?? 0) || 0;
  let ats = Number(fb.ats_score ?? 0) || 0;

  const norm = {
    name: d.name ?? null,
    email: d.email ?? null,
    phone: d.phone ?? null,
    linkedin_url: d.linkedin_url ?? null,
    portfolio_url: d.portfolio_url ?? null,
    summary: d.summary ?? null,

    work_experience: d.work_experience ?? [],
    education: d.education ?? [],
    technical_skills: d.technical_skills ?? [],
    soft_skills: d.soft_skills ?? [],
    projects: d.projects ?? [],
    certifications: d.certifications ?? [],

    feedback_summary: {
      strengths: fb.strengths ?? [],
      areas_to_improve: fb.areas_to_improve ?? (d.improvement_areas ? [d.improvement_areas] : []),
      suggested_skills: fb.suggested_skills ?? (d.upskill_suggestions ?? []),
      overall_rating: overall,
      ats_score: ats
    },

    // keep legacy fields populated too (for DB compatibility)
    resume_rating: overall,
    improvement_areas: (fb.areas_to_improve?.join?.('; ') || d.improvement_areas || null),
    upskill_suggestions: fb.suggested_skills ?? (d.upskill_suggestions ?? [])
  };

  // Fill ATS & strengths if missing
  if (!norm.feedback_summary.ats_score) {
    norm.feedback_summary.ats_score = heuristicATS(norm);
  }
  if (!norm.feedback_summary.strengths?.length) {
    norm.feedback_summary.strengths = heuristicStrengths(norm);
  }

  return norm;
}

function mockAnalysis() {
  return normalize({
    name: "Sample Candidate",
    email: "sample@example.com",
    phone: "+1-555-123-4567",
    linkedin_url: "https://www.linkedin.com/in/sample",
    summary: "Full-stack developer (React/Node) with 3+ years.",
    work_experience: [
      { role: "Frontend Dev", company: "Acme", duration: "2022–Present", description: ["Built React UI", "Optimized performance"] }
    ],
    education: [{ degree: "B.Tech CSE", institution: "ABC University", graduation_year: "2021" }],
    technical_skills: ["React", "Node.js", "PostgreSQL", "Docker", "Git"],
    soft_skills: ["Communication", "Teamwork"],
    projects: [{ title: "E-commerce", tech: ["React", "Express", "Postgres"], summary: "Checkout, payments, admin" }],
    certifications: ["AWS Cloud Practitioner"],
    feedback_summary: {
      strengths: ["Strong JS/React foundation", "Hands-on project work"],
      areas_to_improve: ["Add test coverage metrics", "Quantify impact with numbers"],
      suggested_skills: ["TypeScript", "CI/CD", "System Design"],
      overall_rating: 7,
      ats_score: 82
    }
  });
}

export async function analyzeWithGemini(resumeText) {
  if (MOCK) return mockAnalysis();

  const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = client.getGenerativeModel({ model: MODEL });
  const prompt = STRUCT_PROMPT(String(resumeText).slice(0, MAX_CHARS));

  const result = await model.generateContent(prompt);
  const raw = await result.response.text();
  return normalize(parseJsonFromText(raw));
}
