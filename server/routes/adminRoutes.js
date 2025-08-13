import express from 'express';
import { 
    deleteUser, 
    getAllUsers 
} from '../controllers/admin/adminUserController.js';
import { adminProtectedRoute } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/users', adminProtectedRoute,  getAllUsers);
router.delete('/users/:userId', adminProtectedRoute, deleteUser);

export default router;