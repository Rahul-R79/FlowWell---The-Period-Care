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
import { adminGetOrderDetail, adminGetOrders, adminUpdateOrderStatus } from '../controllers/admin/adminOrderController.js';
import { validateCoupon } from '../middlewares/validators/couponValidator.js';
import { addCoupon, couponStatus, editCoupon, getCoupons, getSingleCoupon } from '../controllers/admin/adminCouponController.js';
import { getReferrals } from '../controllers/admin/adminReferralController.js';
import { getSalesReport } from '../controllers/admin/adminSalesReportController.js';
import { getDashboard } from '../controllers/admin/adminDashboardController.js';
import { validateBanner, validateEditBanner } from '../middlewares/validators/BannerValidator.js';
import { bannerStatus, createBanner, deleteBanner, editBanner, getBanners, getSingleBanner } from '../controllers/admin/adminBannerController.js';

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
router.post('/products/add', adminProtectedRoute, upload.array('images', 4), parseFormData, validateProduct, handleValidation, addProduct);
router.patch('/products/status/:id', adminProtectedRoute, productStatus);
router.get('/products/:id', adminProtectedRoute, getSingleProductById);
router.patch('/products/:id', adminProtectedRoute, upload.array('images', 4), parseFormData, validateProduct, handleValidation, updateProductById);

router.get('/orders', adminProtectedRoute, adminGetOrders);
router.get('/order/detail/:orderId', adminProtectedRoute, adminGetOrderDetail);
router.patch('/order/:orderId/product', adminProtectedRoute, adminUpdateOrderStatus);

router.post('/coupon/add', adminProtectedRoute, validateCoupon, handleValidation, addCoupon);
router.get('/coupon', adminProtectedRoute, getCoupons);
router.get('/coupon/:id', adminProtectedRoute, getSingleCoupon);
router.patch('/coupon/:id', adminProtectedRoute, validateCoupon, handleValidation, editCoupon);
router.patch('/coupon/status/:id', adminProtectedRoute, couponStatus);

router.get('/referrals', adminProtectedRoute, getReferrals);

router.get('/sales-report', adminProtectedRoute, getSalesReport);

router.get('/dashboard', adminProtectedRoute, getDashboard);

router.post('/banner/add', adminProtectedRoute, upload.single('image'), validateBanner, handleValidation, createBanner);
router.get('/banner', adminProtectedRoute, getBanners);
router.get('/banner/:id', adminProtectedRoute, getSingleBanner);
router.patch('/banner/:id', adminProtectedRoute, upload.single('image'), validateEditBanner, handleValidation, editBanner);
router.delete('/banner/:id', adminProtectedRoute, deleteBanner);
router.patch('/banner/status/:id', adminProtectedRoute, bannerStatus);

export default router;