import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { GoTag } from "react-icons/go";
import "./payment.css";
import { createOrder } from "../../../features/orders/orderSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import confetti from "canvas-confetti";

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { totals } = useSelector((state) => state.cart);
    const { selectedAddress } = useSelector((state) => state.address);
    const { loadingByAction } = useSelector((state) => state.order);

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = async () => {
        try {
            await dispatch(
                createOrder({
                    paymentMethod,
                    shippingAddressId: selectedAddress,
                })
            ).unwrap();

            confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 },
            });

            navigate("/payment/success", {replace: true});
        } catch (err) {
            console.log("payment error", err);
        }
    };

    return (
        <>
            {loadingByAction.createOrder && <LoadingSpinner />}
            <UserHeader />
            <section className='checkout-payment container'>
                <h3 className='mb-4 fw-bold'>Select Payment Method</h3>
                <Row>
                    <Col lg={8} md={12}>
                        <div className='payment-conatainer p-3 border rounded'>
                            <Form>
                                {/* Razorpay */}
                                <div className='payment-option mb-3 p-3 border rounded'>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='razorpay'
                                        value='RAZORPAY'
                                        checked={paymentMethod === "RAZORPAY"}
                                        onChange={handlePaymentChange}
                                        label={
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src='/images/icons/razorpay-icon.webp'
                                                    alt='Razorpay'
                                                    className='me-2'
                                                    style={{ height: "50px" }}
                                                />
                                                <span>Razorpay</span>
                                            </div>
                                        }
                                    />
                                </div>

                                {/* GPay */}
                                <div className='payment-option mb-3 p-3 border rounded'>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='gpay'
                                        value='UPI'
                                        checked={paymentMethod === "UPI"}
                                        onChange={handlePaymentChange}
                                        label={
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src='/images/icons/google-pay.webp'
                                                    alt='Google Pay'
                                                    className='me-2'
                                                    style={{ height: "30px" }}
                                                />
                                                <div>
                                                    <span>UPI Payment</span>
                                                    <div className='text-muted small'>
                                                        Pay by any UPI app
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Simpl Pay Later */}
                                <div className='payment-option mb-3 p-3 border rounded'>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='simpl'
                                        value='SIMPL'
                                        checked={paymentMethod === "SIMPL"}
                                        onChange={handlePaymentChange}
                                        label={
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src='/images/icons/simpl_icon.webp'
                                                    alt='Simpl'
                                                    className='me-2'
                                                    style={{ height: "50px" }}
                                                />
                                                <div>
                                                    <span>
                                                        Pay Later with Simpl
                                                    </span>
                                                    <div className='text-muted small'>
                                                        Buy now, pay after 15/30
                                                        days
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Credit / Debit Card */}
                                <div className='payment-option mb-3 p-3 border rounded'>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='card'
                                        value='CARD'
                                        checked={paymentMethod === "CARD"}
                                        onChange={handlePaymentChange}
                                        label={
                                            <div>
                                                <span>
                                                    Credit/Debit/ATM Card
                                                </span>
                                                <div className='text-muted small'>
                                                    Add any secure card by RBI
                                                    guidelines
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Wallet */}
                                <div className='payment-option mb-3 p-3 border rounded'>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='wallet'
                                        value='WALLET'
                                        checked={paymentMethod === "WALLET"}
                                        onChange={handlePaymentChange}
                                        label={
                                            <div>
                                                <span>Wallets</span>
                                                <div className='text-muted small'>
                                                    Pay using Paytm, PhonePe,
                                                    Amazon Pay, etc.
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Cash on Delivery */}
                                <div className='payment-option mb-3 p-3 border rounded'>
                                    <Form.Check
                                        type='radio'
                                        name='paymentMethod'
                                        id='cod'
                                        value='COD'
                                        checked={paymentMethod === "COD"}
                                        onChange={handlePaymentChange}
                                        label={<span>Cash on Delivery</span>}
                                    />
                                </div>
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
                                <span>-₹{totals.discount}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2'>
                                <span>Delivery Fee</span>
                                <span>₹{totals.deliveryFee}</span>
                            </div>
                            <hr />
                            <div className='d-flex justify-content-between fw-bold mb-3'>
                                <span>Total</span>
                                <span>₹{totals.total}</span>
                            </div>

                            {/* Coupon Input */}
                            <div className='coupon-box d-flex mb-3'>
                                <div className='coupon-input-wrapper'>
                                    <GoTag className='coupon-icon' />
                                    <Form.Control
                                        type='text'
                                        placeholder='Apply Coupon'
                                        className='coupon-input'
                                    />
                                </div>
                                <Button className='coupon-btn'>Apply</Button>
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
