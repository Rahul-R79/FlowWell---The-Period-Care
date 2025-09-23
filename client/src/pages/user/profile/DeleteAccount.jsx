//delete user account
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { useSelector, useDispatch } from "react-redux";
import { deleteAccount } from "../../../features/auth/authUserSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "../../../utils/confirmAlert";

function DeleteAccount() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loadingByAction } = useSelector((state) => state.auth);

    const handleDeleteUser = async (id) => {
        try {
            await dispatch(deleteAccount(id)).unwrap();
            navigate("/");
        } catch (err) {
            alert('delete account error');
        }
    };

    const handleDeleteClick = async (id) => {
        const confirmed = await confirmAlert(
            "Delete the account?",
            "Are you sure you want to delete the account permantly",
            "Confirm",
            "Cancel"
        );

        if (confirmed) {
            handleDeleteUser(id);
        }
    };
    return (
        <>
            {loadingByAction.deleteAccount && <LoadingSpinner />}
            <UserHeader />
            <div className='deleteAccount container mt-5 mb-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    {/* Delete Account Card */}
                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12'>
                        <div className='card shadow-sm p-4 border-0'>
                            <h3 className='fw-bold mb-5 text-uppercase text-center'>
                                Delete Your Account
                            </h3>
                            <p className='text-muted'>
                                Is this goodbye? Are you sure you dont want to
                                reconsider?
                            </p>
                            <p className='mb-2'>
                                <strong>You will lose</strong> your order
                                history, saved details, cart, wishlist, and all
                                other coupons and benefits.
                            </p>
                            <p className='mb-2'>
                                Any account-related benefits will be forfeited
                                once the account is deleted and will no longer
                                be available to you. You cannot recover them.
                                However, you can always create a new account. By
                                deleting your account, you acknowledge you have
                                read our Privacy Policy.
                            </p>
                            <p className='mb-2'>
                                Any pending orders, exchanges, returns, or
                                refunds will no longer be accessible via your
                                account.
                            </p>
                            <p className='mb-2'>
                                FlowWell will try to complete any open
                                transactions in the next 30 days on a
                                best-effort basis. However, we cannot guarantee
                                tracking and traceability of shipments or
                                refunds once the account is deleted.
                            </p>
                            <p className='mb-2'>
                                FlowWell may not extend the New User coupon or
                                promotional discounts if a new account is
                                created using the same mobile number or email
                                ID.
                            </p>
                            <p className='mb-2'>
                                FlowWell may refuse or delay deletion if there
                                are any pending grievances related to product
                                deliveries, returns, refunds, cancellations, or
                                subscription services for menstrual products.
                            </p>
                            <p className='mb-3'>
                                FlowWell may retain certain data for legitimate
                                reasons such as safety, fraud prevention, future
                                abuse monitoring, regulatory compliance,
                                including exercising legal rights, or complying
                                with legal orders under applicable laws.
                            </p>

                            <div className='text-center mt-4'>
                                <button
                                    className='btn btn-dark w-75 py-2 fw-bold'
                                    onClick={() => handleDeleteClick(user._id)}>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default DeleteAccount;
