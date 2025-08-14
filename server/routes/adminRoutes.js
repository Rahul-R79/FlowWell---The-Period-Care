import express from 'express';
import { 
    blockUser,
    deleteUser, 
    getAllUsers, 
    unblockUser
} from '../controllers/admin/adminUserController.js';
import { adminProtectedRoute } from '../middlewares/verifyToken.js';
import { validateCategory } from '../middlewares/validators/categoryValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';
import { addCategory } from '../controllers/admin/adminCategoryController.js';

const router = express.Router();

router.get('/users', adminProtectedRoute,  getAllUsers);
router.delete('/users/:userId', adminProtectedRoute, deleteUser);
router.put('/users/block/:userId', adminProtectedRoute, blockUser);
router.put('/users/unblock/:userId', adminProtectedRoute, unblockUser);

router.post('/category/add', validateCategory, handleValidation, adminProtectedRoute, addCategory);

export default router;