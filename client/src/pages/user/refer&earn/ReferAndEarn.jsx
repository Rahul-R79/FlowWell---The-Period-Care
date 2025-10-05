//user refer and earn
import { useEffect, useState } from "react";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import "./referAndEarn.css";
import { useSelector, useDispatch } from "react-redux";
import { getReferralCode } from "../../../features/referral/userReferralSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

function ReferAndEarn() {
    const dispatch = useDispatch();
    const { referral, loadingByAction } = useSelector(
        (state) => state.userReferral
    );
    const WEBSITE_URL = "https://www.flowwell.online";
    const shareMessage = `Join using my referral code: ${referral?.couponCode}\nSign up here: ${WEBSITE_URL}`;

    useEffect(() => {
        dispatch(getReferralCode());
    }, [dispatch]);

    const handleShareClick = (platform) => {
        const encodedMsg = encodeURIComponent(shareMessage);
        let url = "";

        switch (platform) {
            case "whatsapp":
                url = `https://api.whatsapp.com/send?text=${encodedMsg}`;
                break;
            case "gmail":
                url = `mailto:?subject=Referral&body=${encodedMsg}`;
                break;
            case "sms":
                url = `sms:?body=${encodedMsg}`;
                break;
            default:
                return;
        }

        window.open(url, "_blank");
    };

    return (
        <>
            {loadingByAction.getReferralCode && <LoadingSpinner />}
            <UserHeader />
            <div className='referAndEarn container mt-5 mb-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='p-4 shadow rounded bg-white text-center refer-card'>
                            <h3 className='mb-4'>REFER & EARN</h3>
                            <img
                                src='/images/referAndEarn.webp'
                                alt='Refer and Earn Icon'
                                className='refer-img img-fluid'
                            />
                            <h5>Refer now and Earn a 50% off Coupon</h5>
                            <p className='text-muted'>
                                Send a referral code to your friend via
                                SMS/E-mail/Whatsapp
                            </p>

                            <div className='my-4 p-3'>
                                <h5>REFERRAL CODE</h5>
                                <div className='bg-light p-2 d-inline-block referal-code'>
                                    <code>{referral?.couponCode}</code>
                                </div>
                            </div>

                            <button
                                className='btn btn-dark'
                                data-bs-toggle='modal'
                                data-bs-target='#referralModal'>
                                Refer Now
                            </button>
                        </div>

                        {/* Bootstrap Modal */}
                        <div
                            className='modal fade'
                            id='referralModal'
                            tabIndex='-1'
                            aria-labelledby='referralModalLabel'
                            aria-hidden='true'>
                            <div className='modal-dialog modal-dialog-centered'>
                                <div className='modal-content'>
                                    <div className='modal-header'>
                                        <h5
                                            className='modal-title'
                                            id='referralModalLabel'>
                                            Share Referral Code
                                        </h5>
                                        <button
                                            type='button'
                                            className='btn-close'
                                            data-bs-dismiss='modal'
                                            aria-label='Close'></button>
                                    </div>

                                    <div className='modal-body text-center'>
                                        <div className='share-options d-flex justify-content-around flex-wrap'>
                                            <div
                                                className='share-option'
                                                onClick={() =>
                                                    handleShareClick("whatsapp")
                                                }>
                                                <img
                                                    src='/images/referalicons/whatsapp.webp'
                                                    alt='WhatsApp'
                                                    className='share-icon'
                                                />
                                                <span>WhatsApp</span>
                                            </div>

                                            <div
                                                className='share-option'
                                                onClick={() =>
                                                    handleShareClick("gmail")
                                                }>
                                                <img
                                                    src='/images/referalicons/gmail.webp'
                                                    alt='Gmail'
                                                    className='share-icon'
                                                />
                                                <span>Gmail</span>
                                            </div>

                                            <div
                                                className='share-option'
                                                onClick={() =>
                                                    handleShareClick("sms")
                                                }>
                                                <img
                                                    src='/images/referalicons/msg.webp'
                                                    alt='SMS'
                                                    className='share-icon'
                                                />
                                                <span>SMS</span>
                                            </div>

                                            <div className='share-option'>
                                                <img
                                                    src='/images/referalicons/fb.webp'
                                                    alt='Facebook'
                                                    className='share-icon'
                                                />
                                                <span>Facebook</span>
                                            </div>

                                            <div className='share-option'>
                                                <img
                                                    src='/images/referalicons/insta.webp'
                                                    alt='Instagram'
                                                    className='share-icon'
                                                />
                                                <span>Instagram</span>
                                            </div>

                                            <div className='share-option'>
                                                <img
                                                    src='/images/referalicons/snapchat.webp'
                                                    alt='SnapChat'
                                                    className='share-icon'
                                                />
                                                <span>SnapChat</span>
                                            </div>

                                            <div className='share-option'>
                                                <img
                                                    src='/images/referalicons/bluetooth.webp'
                                                    alt='Bluetooth'
                                                    className='share-icon'
                                                />
                                                <span>Bluetooth</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReferAndEarn;
