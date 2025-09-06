import { Router } from 'express';
import multer from 'multer';

import { uploadResume, getAllResumes, getResumeById } from '../controllers/resumeController.js';
import { auth } from '../middlewares/auth.js';

const resumeRoutes = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF allowed'));
    cb(null, true);
  }
});

resumeRoutes.post('/upload', auth, upload.single('resume'), uploadResume);
resumeRoutes.get('/', auth, getAllResumes);
resumeRoutes.get('/:id', auth, getResumeById);

export default resumeRoutes;
