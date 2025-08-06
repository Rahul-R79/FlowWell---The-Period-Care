import express from 'express';
import { SignIn, SignUp } from '../controllers/authController.js';
import { validateSignIn, validateSignUp } from '../middlewares/validators/authValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';

const router = express.Router();

router.post('/signUp', SignUp, validateSignUp, handleValidation);
router.post('/signIn', SignIn, validateSignIn, handleValidation);

export default router;