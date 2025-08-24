import express from 'express';
import upload from '../middlewares/multer.js';

import { getAllProducts, getProductById, searchProduct } from '../controllers/user/userProductController.js';
import { userProtectedRoute } from '../middlewares/verifyToken.js';
import { updateProfile } from '../controllers/user/userProfileController.js';
import { validateProfile } from '../middlewares/validators/profileValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';
import { addAddress, deleteAddress, editAddress, getAllAddresses, getSingleAddress } from '../controllers/user/addressController.js';
import { validateAddress } from '../middlewares/validators/addressValidator.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/product/search', searchProduct);
router.get('/product/:id', getProductById);

router.patch('/profile/edit', userProtectedRoute, upload.single('image'), validateProfile, handleValidation, updateProfile);

router.post('/address/add', userProtectedRoute, validateAddress, handleValidation, addAddress);
router.get('/address', userProtectedRoute, getAllAddresses);
router.get('/address/:id', userProtectedRoute, getSingleAddress);
router.patch('/address/edit/:id', userProtectedRoute, validateAddress, handleValidation, editAddress);
router.delete('/address/delete/:id', userProtectedRoute, deleteAddress);

export default router;