import express from 'express';
import { getAllProducts, getProductById, searchProduct } from '../controllers/user/userProductController.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/product/search', searchProduct);
router.get('/product/:id', getProductById);

export default router;