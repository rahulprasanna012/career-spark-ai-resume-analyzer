// geminiResumeAnalyzer.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const MAX_CHARS = Number(process.env.GEMINI_MAX_CHARS || 24000);
const MOCK = process.env.MOCK_GEMINI === 'true';

const STRUCT_PROMPT = (resumeText) => `
You are an expert technical recruiter + ATS. Return ONLY valid JSON (no prose).

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
    "overall_feedback": "string",  // REQUIRED: 2–3 sentences that sell the candidate
    "overall_rating": 0,
    "ats_score": 0
  }
}
Rules:
- "overall_feedback" MUST be 2–3 concise sentences; never null.
- "overall_rating" is 1–10 integer.
- "ats_score" is 0–100 integer (clarity, keywords, contact info, structure).
`;

// --- parsing & heuristics ---

function parseJsonFromText(raw) {
  const s = raw.indexOf('{'); const e = raw.lastIndexOf('}');
  const txt = s >= 0 && e > s ? raw.slice(s, e + 1) : '{}';
  try { return JSON.parse(txt); } catch { return {}; }
}

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
  if (!data.feedback_summary?.overall_feedback) score -= 5;

  return Math.max(0, Math.min(100, score));
}

function heuristicStrengths(data) {
  const out = [];
  if ((data.technical_skills || []).length >= 5) out.push('Good breadth of technical skills');
  if ((data.work_experience || []).length >= 2) out.push('Solid experience history');
  if (data.linkedin_url) out.push('Public professional profile provided');
  if (data.projects?.length) out.push('Hands-on project experience');
  if (!out.length) out.push('Clear formatting and basic information present');
  return out;
}

// Always produce a short, crisp overall line if missing
function genOverallFeedback({ overall_rating, ats_score, fallback }) {
  if (overall_rating >= 8 || ats_score >= 85) return 'This resume is strong and market-ready.';
  if (overall_rating >= 6 || ats_score >= 70) return 'This resume showcases a solid foundation.';
  if (overall_rating >= 4 || ats_score >= 55) return 'This resume is promising but needs refinement.';
  if (fallback) {
    const s = String(fallback)
      .split(/[.?!]/)
      .map((t) => t.trim())
      .filter(Boolean)[0];
    if (s && s.length <= 100) return s.endsWith('.') ? s : s + '.';
  }
  return 'This resume needs restructuring to meet hiring expectations.';
}

// --- normalization ---

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
      overall_feedback: fb.overall_feedback ?? '',
      overall_rating: overall,
      ats_score: ats
    },

    // legacy compatibility
    resume_rating: overall,
    improvement_areas: (fb.areas_to_improve?.join?.('; ') || d.improvement_areas || null),
    upskill_suggestions: fb.suggested_skills ?? (d.upskill_suggestions ?? [])
  };

  if (!norm.feedback_summary.ats_score) {
    norm.feedback_summary.ats_score = heuristicATS(norm);
  }
  if (!norm.feedback_summary.strengths?.length) {
    norm.feedback_summary.strengths = heuristicStrengths(norm);
  }
  if (!norm.feedback_summary.overall_feedback) {
    norm.feedback_summary.overall_feedback = genOverallFeedback({
      overall_rating: norm.feedback_summary.overall_rating,
      ats_score: norm.feedback_summary.ats_score,
      fallback: null
    });
  }

  return norm;
}

// --- mock path ---

function mockAnalysis() {
  return normalize({
    name: 'Sample Candidate',
    email: 'sample@example.com',
    phone: '+1-555-123-4567',
    linkedin_url: 'https://www.linkedin.com/in/sample',
    portfolio_url: null,
    work_experience: [
      {
        role: 'Frontend Dev',
        company: 'Acme',
        duration: '2022–Present',
        description: ['Built React UI', 'Optimized performance']
      }
    ],
    education: [{ degree: 'B.Tech CSE', institution: 'ABC University', graduation_year: '2021' }],
    technical_skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    soft_skills: ['Communication', 'Teamwork'],
    projects: [{ title: 'E-commerce', tech: ['React', 'Express', 'Postgres'], summary: 'Checkout, payments, admin' }],
    certifications: ['AWS Cloud Practitioner'],
    feedback_summary: {
      strengths: ['Strong JS/React foundation', 'Hands-on project work'],
      areas_to_improve: ['Add test coverage metrics', 'Quantify impact with numbers'],
      suggested_skills: ['TypeScript', 'CI/CD', 'System Design'],
      overall_feedback: 'This resume showcases a solid foundation.',
      overall_rating: 7,
      ats_score: 82
    }
  });
}

// --- main API ---

export async function analyzeWithGemini(resumeText) {
  if (MOCK) return mockAnalysis();

  const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = client.getGenerativeModel({ model: MODEL });
  const prompt = STRUCT_PROMPT(String(resumeText).slice(0, MAX_CHARS));

  const result = await model.generateContent(prompt);
  const raw = await result.response.text();
  return normalize(parseJsonFromText(raw));
}

// Optional named exports
export {
  STRUCT_PROMPT,
  parseJsonFromText,
  heuristicATS,
  heuristicStrengths,
  genOverallFeedback,
  normalize,
  mockAnalysis
};
