// For a row in the history table (list view)
export type ResumeListRow = {
  id: number;
  user_id: number;
  file_name: string | null;
  uploaded_at: string;             // ISO string
  name: string | null;
  email: string | null;
  resume_rating: number | null;    // 1–10
  ats_score: number | null;        // 0–100
};

// For nested structures
export type WorkExperience = {
  role: string;
  company: string;
  duration: string;
  description: string[];
};

export type Education = {
  degree: string;
  institution: string;
  graduation_year: string;
};

export type Project = {
  title: string;
  tech: string[];
  summary: string;
};

// Full detail view (modal / result page)
export type ResumeFull = ResumeListRow & {
  phone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  summary: string | null;                // overall feedback
  work_experience: WorkExperience[];
  education: Education[];
  technical_skills: string[];
  soft_skills: string[];
  projects: Project[];
  certifications: string[];
  strengths: string[];
  improvement_areas: string | null;      // semicolon-joined string
  areas_to_improve?: string[];           // normalized array
  upskill_suggestions: string[];
};
