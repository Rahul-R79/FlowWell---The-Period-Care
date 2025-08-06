import express from 'express';
import { SignIn, SignUp } from '../controllers/authController.js';
import { validateSignIn, validateSignUp } from '../middlewares/validators/authValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';

const router = express.Router();

router.post('/signup', validateSignUp, handleValidation, SignUp);
router.post('/signin', validateSignIn, handleValidation, SignIn);

export default router;