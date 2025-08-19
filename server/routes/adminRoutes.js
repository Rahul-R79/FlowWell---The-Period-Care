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
import { 
    addCategory, 
    categoryStatus, 
    editCategory, 
    getCategory, 
    getSingleCategory 
} from '../controllers/admin/adminCategoryController.js';
import { addProduct, getProduct, getSingleProductById, productStatus, updateProductById } from '../controllers/admin/adminProductsController.js';
import { parseFormData, validateProduct } from '../middlewares/validators/productValidator.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.get('/users', adminProtectedRoute,  getAllUsers);
router.delete('/users/:userId', adminProtectedRoute, deleteUser);
router.patch('/users/block/:userId', adminProtectedRoute, blockUser);
router.patch('/users/unblock/:userId', adminProtectedRoute, unblockUser);


router.get('/category', adminProtectedRoute, getCategory);
router.post('/category/add', validateCategory, handleValidation, adminProtectedRoute, addCategory);
router.get('/category/:id', adminProtectedRoute, getSingleCategory);
router.patch('/category/:id', validateCategory, handleValidation, adminProtectedRoute, editCategory);
router.patch('/category/status/:id', adminProtectedRoute, categoryStatus);


router.get('/products', adminProtectedRoute, getProduct);
router.post('/products/add', upload.array('images', 4), parseFormData, validateProduct, handleValidation, adminProtectedRoute, addProduct);
router.patch('/products/status/:id', adminProtectedRoute, productStatus);
router.get('/products/:id', adminProtectedRoute, getSingleProductById);
router.patch('/products/:id', upload.array('images', 4), parseFormData, validateProduct, handleValidation, adminProtectedRoute, updateProductById);

export default router;