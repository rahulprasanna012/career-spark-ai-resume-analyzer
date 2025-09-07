import pdfParse from 'pdf-parse';
import { pool } from '../config/db.js';
import { analyzeWithGemini } from '../utils/analysisService.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // 1) Extract text from PDF
    const { text } = await pdfParse(req.file.buffer);
    if (!text?.trim()) return res.status(400).json({ error: 'Unreadable PDF' });

    // 2) Analyze via Gemini (returns structured JSON)
    const analysis = await analyzeWithGemini(text);

    // 3) Save into Postgres
    const q = `
      INSERT INTO public.resumes
      (user_id, file_name, name, email, phone, linkedin_url, portfolio_url, summary,
       work_experience, education, technical_skills, soft_skills, projects, certifications,
       resume_rating, improvement_areas, upskill_suggestions, strengths, ats_score)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING *;
    `;

    const vals = [
      req.user.id,
      req.file.originalname,
      analysis.name || null,
      analysis.email || null,
      analysis.phone || null,
      analysis.linkedin_url || null,
      analysis.portfolio_url || null,
      analysis.feedback_summary?.overall_feedback || null, // mapped to DB "summary" column
      JSON.stringify(analysis.work_experience || []),
      JSON.stringify(analysis.education || []),
      JSON.stringify(analysis.technical_skills || []),
      JSON.stringify(analysis.soft_skills || []),
      JSON.stringify(analysis.projects || []),
      JSON.stringify(analysis.certifications || []),
      Number(analysis.resume_rating ?? analysis.feedback_summary?.overall_rating ?? 0),
      analysis.improvement_areas || null,
      JSON.stringify(analysis.upskill_suggestions || analysis.feedback_summary?.suggested_skills || []),
      JSON.stringify(analysis.feedback_summary?.strengths || []),
      Number(analysis.feedback_summary?.ats_score ?? 0)
    ];

    const { rows } = await pool.query(q, vals);
    res.json(rows[0]);
  } catch (e) {
    console.error('UPLOAD ERR:', e);
    res.status(500).json({ error: e.message || 'Upload failed' });
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, file_name, uploaded_at, name, email, resume_rating
       FROM public.resumes
       WHERE user_id = $1
       ORDER BY uploaded_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error('LIST ERR:', e);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

export const getResumeById = async (req, res) => {

  console.log(req.user)
  try {
    const { rows } = await pool.query(
      `SELECT * FROM public.resumes WHERE id=$1 AND user_id=$2`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error('DETAIL ERR:', e);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};
