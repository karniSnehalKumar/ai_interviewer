import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {upload} from '../middleware/multer.js';
import { aiLimiter, uploadLimiter } from '../middleware/rateLimiter.js';
import {analyzeResume} from '../controllers/interview.controller.js';
import {generateQuestion} from '../controllers/interview.controller.js';
import {submitAnswer} from '../controllers/interview.controller.js';
import {finishInterview} from '../controllers/interview.controller.js';
import {getMyInterviews} from '../controllers/interview.controller.js';

const interviewRouter = express.Router();

// uploadLimiter: 5 uploads per 10 min per IP  →  isAuth  →  multer  →  analyzeResume
interviewRouter.post('/resume', uploadLimiter, isAuth, upload.single("resume"), analyzeResume);

// aiLimiter: 10 requests per 1 min per IP  →  isAuth  →  generateQuestion
interviewRouter.post("/generate-questions", aiLimiter, isAuth, generateQuestion);

// aiLimiter: 10 requests per 1 min per IP  →  isAuth  →  submitAnswer
interviewRouter.post("/submit-answer", aiLimiter, isAuth, submitAnswer)

// No specific limiter — covered by generalLimiter in index.js
interviewRouter.post("/finish", isAuth, finishInterview)
interviewRouter.get("/get-interview", isAuth, getMyInterviews)

export default interviewRouter;