import express from 'express';
import { 
    authMe,
    forgotPassword, 
    forgotResetPassword, 
    googleAuthCallback, 
    resendForgotOTP, 
    resendOTP, SignIn, 
    SignUp, 
    userLogout, 
    verifyForgotOTP, 
    verifyOTP 
} from '../controllers/authController.js';
import { 
    validateEmail, 
    validateforResetPass, 
    validateSignIn, 
    validateSignUp 
} from '../middlewares/validators/authValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';
import passport from '../config/passport.js'
import ProtectedRoute from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', validateSignUp, handleValidation, SignUp);
router.post('/otp-verify', handleValidation, verifyOTP);
router.post('/otp-resend', handleValidation, resendOTP);
router.post('/signin', validateSignIn, handleValidation, SignIn);
router.post('/forgot-password', validateEmail, handleValidation, forgotPassword);
router.post('/forgot-verify', handleValidation, verifyForgotOTP);
router.post('/forgot-resend', handleValidation, resendForgotOTP);
router.post('/reset-forgot-password', ProtectedRoute, validateforResetPass, handleValidation, forgotResetPassword);
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/signin', session: false}), googleAuthCallback);
router.get('/authme', ProtectedRoute, authMe);
router.post('/logout', userLogout);
export default router;