import express from 'express';
import upload from '../middlewares/multer.js';

import { getAllProducts, getProductById, searchProduct } from '../controllers/user/userProductController.js';
import { userProtectedRoute } from '../middlewares/verifyToken.js';
import { updateProfile } from '../controllers/user/userProfileController.js';
import { validateProfile } from '../middlewares/validators/profileValidator.js';
import { handleValidation } from '../middlewares/validators/handleValidation.js';
import { addAddress, deleteAddress, editAddress, getAllAddresses, getSingleAddress } from '../controllers/user/addressController.js';
import { validateAddress } from '../middlewares/validators/addressValidator.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/user/wishlistController.js';
import { addToCart, getCartItems, removeFromCart } from '../controllers/user/cartController.js';
import { cancelOrder, createOrder, createRazorpayOrder, getInvoice, getOrderItem, getOrders, processWalletPayment, ReturnOrder, verifyPayment } from '../controllers/user/orderController.js';
import { applyCoupon, getUserCoupon } from '../controllers/user/couponController.js';
import { addMoneyToWallet, getWalletAmount, getWalletTransactions, verifyWalletPayment } from '../controllers/user/walletController.js';
import { getReferralCode } from '../controllers/user/ReferralController.js';
import { addReview, getAllReviews, getReviewsByProduct } from '../controllers/user/reviewController.js';
import { validateReview } from '../middlewares/validators/reviewValidator.js';

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

router.post('/wishlist/add', userProtectedRoute, addToWishlist);
router.get('/wishlist', userProtectedRoute, getWishlist);
router.delete('/wishlist/:productId', userProtectedRoute, removeFromWishlist);

router.post('/cart/add', userProtectedRoute, addToCart);
router.get('/cart', userProtectedRoute, getCartItems);
router.delete('/cart/:productId/:selectedSize', userProtectedRoute, removeFromCart);

router.post('/payment', userProtectedRoute, createOrder);

router.get('/orders', userProtectedRoute, getOrders);
router.get('/order/detail/:orderId/:productId', userProtectedRoute, getOrderItem);
router.patch('/order/cancel/:orderId/:productId', userProtectedRoute, cancelOrder);
router.patch('/order/return/:orderId/:productId', userProtectedRoute, ReturnOrder);
router.get("/orders/:id/invoice", userProtectedRoute, getInvoice);
router.post('/order/razorpay', userProtectedRoute, createRazorpayOrder);
router.post('/order/razorpay/verify', userProtectedRoute, verifyPayment);

router.get('/coupon', userProtectedRoute, getUserCoupon);
router.post('/coupon/apply', userProtectedRoute, applyCoupon);

router.post('/wallet/add', userProtectedRoute, addMoneyToWallet);
router.post('/wallet/add/verify', userProtectedRoute, verifyWalletPayment);
router.get('/wallet', userProtectedRoute, getWalletAmount);
router.post('/wallet-payment', userProtectedRoute, processWalletPayment);
router.get('/wallet/transaction', userProtectedRoute, getWalletTransactions);

router.get('/referral', userProtectedRoute, getReferralCode);

router.post('/add-reviews', userProtectedRoute, validateReview, handleValidation, addReview);
router.get('/reviews/:productId', userProtectedRoute, getReviewsByProduct);
router.get('/reviews', userProtectedRoute, getAllReviews);

export default router;