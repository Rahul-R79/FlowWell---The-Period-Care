//user wallet history page
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import PaginationButton from "../../../components/Pagination";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getWalletTransactions } from "../../../features/walletSlice";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

function WalletHistory() {
    const dispatch = useDispatch();
    const { transactions, loadingByAction, currentPage, totalPages } =
        useSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(getWalletTransactions({ page: currentPage, limit: 5 }));
    }, [dispatch, currentPage]);

    const handlePageChange = (page) => {
        dispatch(getWalletTransactions({ page }));
    };

    return (
        <>
            {loadingByAction.getWalletTransactions && <LoadingSpinner />}
            <UserHeader />
            <div className='wallet container mt-5 mb-5'>
                <div className='row'>
                    {/* Sidebar */}
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    {/* Transaction Section */}
                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='p-4 shadow rounded bg-white'>
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h3 className='mb-0 mx-auto fw-bold'>
                                    TRANSACTION HISTORY
                                </h3>
                            </div>

                            {/* Transactions List */}
                            <div className='transaction-list'>
                                {transactions.map((transaction) => (
                                    <Card
                                        key={transaction._id}
                                        className='mb-3 p-3 shadow-sm border-0 transaction-card'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                {transaction.type ===
                                                "debit" ? (
                                                    <h6 className='text-danger'>
                                                        Amount Debited
                                                    </h6>
                                                ) : (
                                                    <h6 className='text-success'>
                                                        Amount Credited
                                                    </h6>
                                                )}
                                                <small className='text-muted'>
                                                    {transaction.paymentMethod}
                                                </small>
                                                <br />
                                                <small className='text-primary'>
                                                    {transaction.transactionFor}{" "}
                                                    on{" "}
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toDateString()}
                                                </small>
                                            </div>
                                            <div
                                                className={`amount d-flex justify-content-start align-items-center fw-bold ${
                                                    transaction.type === "debit"
                                                        ? "text-danger"
                                                        : "text-success"
                                                }`}>
                                                <span className='me-1'>
                                                    {transaction.type ===
                                                    "debit"
                                                        ? "-"
                                                        : "+"}
                                                </span>
                                                <span>
                                                    ₹{transaction.amount}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {transactions.length > 0 && (
                                <PaginationButton
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default WalletHistory;
