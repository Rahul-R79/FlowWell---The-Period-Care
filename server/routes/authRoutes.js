import express from 'express';
import { forgotPassword, resendForgotOTP, resendOTP, SignIn, SignUp, verifyForgotOTP, verifyOTP } from '../controllers/authController.js';
import { validateforResetPass, validateSignIn, validateSignUp } from '../middlewares/validators/authValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';

const router = express.Router();

router.post('/signup', validateSignUp, handleValidation, SignUp);
router.post('/otp-verify', handleValidation, verifyOTP);
router.post('/otp-resend', handleValidation, resendOTP);
router.post('/signin', validateSignIn, handleValidation, SignIn);
router.post('/forgot-password', validateforResetPass, handleValidation, forgotPassword);
router.post('/forgot-verify', handleValidation, verifyForgotOTP);
router.post('/forgot-resend', handleValidation, resendForgotOTP);
export default router;