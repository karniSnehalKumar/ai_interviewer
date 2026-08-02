import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {upload} from '../middleware/multer.js';
import {analyzeResume} from '../controller/interview.controller.js';
import {generateQuestion} from '../controller/interview.controller.js';
import {submitAnswer} from '../controller/interview.controller.js';
import {finishInterview} from '../controller/interview.controller.js';

const interviewRouter = express.Router();


interviewRouter.post('/resume', isAuth,upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions",isAuth,generateQuestion);
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)

export default interviewRouter;