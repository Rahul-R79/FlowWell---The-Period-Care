import { useState } from "react";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import "./wallet.css";
import { useSelector, useDispatch } from "react-redux";
import {
    addMoneyToWallet,
    verifyWalletPayment,
} from "../../../features/walletSlice";
import { useLocation, useNavigate } from "react-router-dom";
import ToastNotification, {
    showSuccessToast,
    showErrorToast,
} from "../../../components/ToastNotification";
import LoadingSpinner from "../../../components/LoadingSpinner";

function AddMoneyToWallet() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const {loadingByAction} = useSelector(state => state.wallet)
    const { user } = useSelector((state) => state.auth);

    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const queryParams = new URLSearchParams(location.search);
    const initialAmount = queryParams.get("amount") 
    const [amount, setAmount] = useState(initialAmount);

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const {
                orderId,
                amount: Orderamount,
                currency,
                key,
            } = await dispatch(addMoneyToWallet({addAmount: amount})).unwrap();

            const options = {
                key,
                amount: Orderamount,
                currency,
                order_id: orderId,

                handler: async function (response) {
                    const {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    } = response;

                    try {
                        await dispatch(
                            verifyWalletPayment({
                                userId: user._id,
                                razorpay_order_id,
                                razorpay_payment_id,
                                razorpay_signature,
                                addedAmount: amount,
                            })
                        ).unwrap();
                        showSuccessToast("Payment Successful!");
                        setTimeout(() => {
                            navigate("/wallet");
                        }, 600);
                    } catch (err) {
                        showErrorToast("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            showErrorToast("payment initialization failed");
        }
    };

    return (
        <>
            {loadingByAction.addMoneyToWallet && <LoadingSpinner/>}
            <UserHeader />
            <ToastNotification/>
            <div className='wallet container my-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4'>
                        <div className='wallet-card p-5 shadow rounded bg-white text-center'>
                            <h3 className='wallet-title mb-5'>MY WALLET</h3>

                            <form onSubmit={handlePayment}>
                                <div className='wallet-input-group mb-4 align-items-center'>
                                    <label className='wallet-label me-3'>
                                        Amount
                                    </label>
                                    <input
                                        type='number'
                                        className='wallet-input'
                                        value={amount}
                                        min={500}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className='wallet-radio-group mb-4 justify-content-center'>
                                    <div className='wallet-radio-item'>
                                        <input
                                            type='radio'
                                            id='razorpay'
                                            name='paymentMethod'
                                            value='razorpay'
                                            className='checkbox-input'
                                            checked={
                                                paymentMethod === "razorpay"
                                            }
                                            onChange={() =>
                                                setPaymentMethod("razorpay")
                                            }
                                        />
                                        <label htmlFor='razorpay'>
                                            <img
                                                src='/images/icons/razorpay-icon.webp'
                                                alt='Razorpay'
                                                style={{width: '200px', height: '200px'}}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    className='wallet-add-button'>
                                    ADD
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AddMoneyToWallet;
