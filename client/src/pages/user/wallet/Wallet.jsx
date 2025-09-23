//user wallet page
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWalletAmount } from "../../../features/walletSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

function Wallet() {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(500);
    const { balance, loadingByAction } = useSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(getWalletAmount());
    }, [dispatch]);

    return (
        <>
            {loadingByAction.getWalletAmount && <LoadingSpinner />}
            <UserHeader />
            <div className='wallet container mt-5 mb-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='p-4 shadow rounded bg-white'>
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h3 className='mb-0 mx-auto fw-bold'>
                                    MY WALLET
                                </h3>
                            </div>

                            {/* Total Balance Display */}
                            <div className='bg-light p-4 rounded mb-4'>
                                <h5>Total Balance</h5>
                                <div className='d-flex justify-content-between align-items-center mt-3'>
                                    <span>Wallet</span>
                                    <span className='fw-bold'>₹{balance}</span>
                                </div>
                            </div>

                            {/* Add Money Section */}
                            <div className='bg-light p-4 rounded mb-4'>
                                <h5>Add Money to Wallet</h5>
                                <div className='d-flex gap-2 mb-3'>
                                    <button
                                        className={`btn btn-outline-secondary ${
                                            amount === 500 ? "active" : ""
                                        }`}
                                        onClick={() => setAmount(500)}>
                                        +₹500
                                    </button>
                                    <button
                                        className={`btn btn-outline-secondary ${
                                            amount === 1000 ? "active" : ""
                                        }`}
                                        onClick={() => setAmount(1000)}>
                                        +₹1000
                                    </button>
                                    <button
                                        className={`btn btn-outline-secondary ${
                                            amount === 5000 ? "active" : ""
                                        }`}
                                        onClick={() => setAmount(5000)}>
                                        +₹5000
                                    </button>
                                </div>
                                <Link
                                    className='btn btn-dark'
                                    to={`/wallet/add?amount=${amount}`}>
                                    Add money to wallet
                                </Link>
                            </div>

                            {/* Transaction History Button */}
                            <Link
                                className='btn btn-primary'
                                to={"/wallet/transactions"}>
                                See Transaction History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Wallet;
