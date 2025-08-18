import express from 'express';
import { userProtectedRoute } from '../middlewares/verifyToken.js';
import { getAllProducts } from '../controllers/user/userProductController.js';

const router = express.Router();

router.get('/products', userProtectedRoute, getAllProducts);

export default router;