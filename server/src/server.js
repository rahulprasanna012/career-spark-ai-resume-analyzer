

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import  { authRouter } from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js'
dotenv.config();

const app = express();
app.use(cors());

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));


app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server Running in port :${PORT}`));
