import express from 'express';
import { userProtectedRoute } from '../middlewares/verifyToken.js';
import { getAllProducts, getProductById } from '../controllers/user/userProductController.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/product/:id', userProtectedRoute, getProductById);

export default router;