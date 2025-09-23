//user payment page
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { GoTag } from "react-icons/go";
import "./payment.css";
import { createOrder } from "../../../features/orders/orderSlice";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import confetti from "canvas-confetti";
import axios from "axios";
import { payWithWallet } from "../../../features/orders/orderSlice";
import { getWalletAmount } from "../../../features/walletSlice";
import ToastNotification, {
    showErrorToast,
    showSuccessToast,
} from "../../../components/ToastNotification";

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { totals, cart } = useSelector((state) => state.cart);
    const { selectedAddress } = useSelector((state) => state.address);
    const { loadingByAction } = useSelector((state) => state.order);
    const { appliedCoupon } = useSelector((state) => state.coupon);
    const { balance } = useSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(getWalletAmount());
    }, [dispatch]);

    const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const calculateTotal = {
        ...totals,
        discount: totals.discount + (appliedCoupon?.discountAmount || 0),
        total: totals.total - (appliedCoupon?.discountAmount || 0),
    };

    const handlePlaceOrder = async () => {
        if (paymentMethod === "RAZORPAY") {
            try {
                const response = await axios.post(
                    "http://localhost:3000/api/user/order/razorpay",
                    { amount: totals.total },
                    { withCredentials: true }
                );

                const data = response.data;

                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    name: "FlowWell",
                    description: "Order Payment",
                    order_id: data.orderId,
                    handler: async function (res) {
                        try {
                            const verifyResponse = await axios.post(
                                "http://localhost:3000/api/user/order/razorpay/verify",
                                {
                                    razorpay_order_id: res.razorpay_order_id,
                                    razorpay_payment_id:
                                        res.razorpay_payment_id,
                                    razorpay_signature: res.razorpay_signature,
                                    orderData: {
                                        cart,
                                        subtotal: totals.subtotal,
                                        discount: totals.discount,
                                        deliveryFee: totals.deliveryFee,
                                        total: totals.total,
                                        shippingAddress: selectedAddress,
                                        appliedCouponId:
                                            appliedCoupon?._id || null,
                                        paymentMethod: "RAZORPAY",
                                    },
                                },
                                { withCredentials: true }
                            );

                            if (verifyResponse.data.order) {
                                confetti({
                                    particleCount: 200,
                                    spread: 70,
                                    origin: { y: 0.6 },
                                });
                                navigate("/payment/success", { replace: true });
                            } else {
                                navigate("/payment/failed", { replace: true });
                            }
                        } catch (err) {
                            navigate("/payment/failed", { replace: true });
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            navigate("/payment/failed", { replace: true });
                        },
                    },
                    theme: { color: "#3399cc" },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } catch (err) {
                alert("Payment initialization failed. Please try again.");
            }
        } else if (paymentMethod === "WALLET") {
            try {
                await dispatch(
                    payWithWallet({
                        walletAmount: calculateTotal.total,
                        shippingAddressId: selectedAddress,
                        orderData: {
                            cart,
                            subtotal: totals.subtotal,
                            discount: calculateTotal.discount,
                            deliveryFee: totals.deliveryFee,
                            total: calculateTotal.total,
                            appliedCouponId: appliedCoupon?._id || null,
                        },
                    })
                ).unwrap();

                dispatch(getWalletAmount());
                confetti({
                    particleCount: 200,
                    spread: 70,
                    origin: { y: 0.6 },
                });
                navigate("/payment/success", { replace: true });
            } catch (err) {
                showErrorToast(err.message);
                setTimeout(() => {
                    navigate("/payment/failed", { replace: true });
                }, 1500);
            }
        } else {
            try {
                await dispatch(
                    createOrder({
                        paymentMethod,
                        shippingAddressId: selectedAddress,
                        appliedCouponId: appliedCoupon?._id || null,
                    })
                ).unwrap();

                confetti({
                    particleCount: 200,
                    spread: 70,
                    origin: { y: 0.6 },
                });
                navigate("/payment/success", { replace: true });
            } catch (err) {
                navigate("/payment/failed", { replace: true });
            }
        }
    };

    return (
        <>
            {loadingByAction.createOrder && <LoadingSpinner />}
            <UserHeader />
            <ToastNotification />
            <section className='checkout-payment container'>
                <h3 className='mb-4 fw-bold'>Select Payment Method</h3>
                <Row>
                    <Col lg={8} md={12}>
                        <div className='payment-conatainer p-3 border rounded'>
                            <Form>
                                {/* Razorpay */}
                                <label
                                    className={`payment-option mb-3 p-3 border rounded d-flex align-items-center cursor-pointer ${
                                        paymentMethod === "RAZORPAY"
                                            ? "border-primary"
                                            : ""
                                    }`}>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='razorpay'
                                        value='RAZORPAY'
                                        checked={paymentMethod === "RAZORPAY"}
                                        onChange={handlePaymentChange}
                                        className='me-2'
                                    />
                                    <img
                                        src='/images/icons/razorpay-icon.webp'
                                        alt='Razorpay'
                                        className='me-2'
                                        style={{ height: "50px" }}
                                    />
                                    <span>Razorpay</span>
                                </label>

                                {/* Simpl Pay Later */}
                                <label
                                    className={`payment-option mb-3 p-3 border rounded d-flex align-items-center cursor-pointer ${
                                        paymentMethod === "SIMPL"
                                            ? "border-primary"
                                            : ""
                                    }`}>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='simpl'
                                        value='SIMPL'
                                        checked={paymentMethod === "SIMPL"}
                                        onChange={handlePaymentChange}
                                        className='me-2'
                                    />
                                    <img
                                        src='/images/icons/simpl_icon.webp'
                                        alt='Simpl'
                                        className='me-2'
                                        style={{ height: "50px" }}
                                    />
                                    <div>
                                        <span>Pay Later with Simpl</span>
                                        <div className='text-muted small'>
                                            Buy now, pay after 15/30 days
                                        </div>
                                    </div>
                                </label>

                                {/* Wallet */}
                                <label
                                    className={`payment-option mb-3 p-3 border rounded d-flex align-items-center cursor-pointer ${
                                        paymentMethod === "WALLET"
                                            ? "border-primary"
                                            : ""
                                    }`}>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='wallet'
                                        value='WALLET'
                                        checked={paymentMethod === "WALLET"}
                                        onChange={handlePaymentChange}
                                        className='me-2'
                                    />
                                    <div>
                                        <span>Wallets</span>
                                        <div className='text-warning small'>
                                            Wallet balance - {balance}
                                        </div>
                                    </div>
                                </label>

                                {/* Cash on Delivery */}
                                <label
                                    className={`payment-option mb-3 p-3 border rounded d-flex align-items-center cursor-pointer ${
                                        paymentMethod === "COD"
                                            ? "border-primary"
                                            : ""
                                    }`}>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='cod'
                                        value='COD'
                                        checked={paymentMethod === "COD"}
                                        onChange={handlePaymentChange}
                                        className='me-2'
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                            </Form>
                        </div>
                    </Col>

                    {/* Right side: Order Summary */}
                    <Col lg={4} md={12} className='mt-4 mt-lg-0'>
                        <div className='order-summary p-3 border rounded sticky-summary'>
                            <h5 className='mb-3 fw-bold'>Order Summary</h5>
                            <div className='d-flex justify-content-between mb-2'>
                                <span>Subtotal</span>
                                <span>₹{totals.subtotal}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2 text-danger'>
                                <span>Discount</span>
                                <span>-₹{calculateTotal.discount}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2'>
                                <span>Delivery Fee</span>
                                <span>₹{totals.deliveryFee}</span>
                            </div>
                            <hr />
                            <div className='d-flex justify-content-between fw-bold mb-3'>
                                <span>Total</span>
                                <span>₹{calculateTotal.total}</span>
                            </div>

                            {/* Coupon Input */}
                            <div className='coupon-box d-flex mb-3'>
                                <div className='coupon-input-wrapper'>
                                    <GoTag className='coupon-icon' />
                                    <Form.Control
                                        type='text'
                                        placeholder='Apply Coupon'
                                        className='coupon-input'
                                        value={
                                            appliedCoupon
                                                ? appliedCoupon.couponCode
                                                : ""
                                        }
                                        readOnly
                                    />
                                </div>
                                <Link to='/coupons' className='coupon-btn'>
                                    Apply
                                </Link>
                            </div>

                            <Button
                                variant='dark'
                                className='w-100'
                                onClick={handlePlaceOrder}>
                                Go to Checkout
                            </Button>
                        </div>
                    </Col>
                </Row>
            </section>
            <Footer />
        </>
    );
};

export default Payment;
