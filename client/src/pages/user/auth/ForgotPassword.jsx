//user forgot password email verify page
import { Link } from "react-router-dom";
import "./auth.css";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../features/auth/authUserSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

function ForgotPassword() {
    const { user, loadingByAction, errorByAction } = useSelector(
        (state) => state.auth
    );
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const forgotPasswordLoading = loadingByAction.forgotPassword;

    const getFieldError = (fieldName) => {
        return errorByAction.forgotPassword?.find((e) => e.field === fieldName)
            ?.message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(forgotPassword({ email })).unwrap();
            localStorage.setItem("forgotMail", email);
            localStorage.setItem("otpStartTime_forgot-password", Date.now());
            navigate("/otpverification?flow=forgot-password");
        } catch (err) {
        }
    };

    return (
        <>
            {forgotPasswordLoading && <LoadingSpinner />}
            <div className='min-vh-100 d-flex align-items-center justify-content-center text-white px-3 py-4 authForm'>
                <div className='container'>
                    <div className='row shadow-lg rounded-4 overflow-hidden bg-transparent'>
                        {/* Left Image Section */}
                        <div className='col-lg-6 bg-white d-flex align-items-center justify-content-center'>
                            <div className='w-100 px-3 text-center'>
                                <h4 className='fw-bold text-dark mb-3 mt-3 text-flowwell'>
                                    FlowWell
                                </h4>
                                <img
                                    src='/images/hero/hero_img2.webp'
                                    alt='FlowWell menstrual gift hamper'
                                    className='img-fluid rounded-4 hero-img'
                                />
                            </div>
                        </div>

                        {/* Right Form Section */}
                        <div className='col-lg-6 p-5 d-flex align-items-center justify-content-center right-form '>
                            <div className='w-100'>
                                <h2 className='fw-semibold mb-3'>
                                    Change Password
                                </h2>
                                <p className='text-light mb-4'>
                                    Please confirm your mail address
                                </p>

                                <form noValidate onSubmit={handleSubmit}>
                                    {/* Email */}
                                    <div className='mb-5'>
                                        <label
                                            htmlFor='email'
                                            className='form-label small text-light'>
                                            Email
                                        </label>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-transparent border-0 text-white'>
                                                <i className='bi bi-envelope' />
                                            </span>
                                            <input
                                                type='email'
                                                id='email'
                                                name='email'
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                value={email}
                                                className='form-control text-light bg-transparent'
                                                placeholder='Enter your email address'
                                                required
                                            />
                                        </div>
                                        {getFieldError("email") && (
                                            <small className='text-danger'>
                                                {getFieldError("email")}
                                            </small>
                                        )}
                                    </div>

                                    {/* Login Button */}
                                    <div className='d-grid mb-4'>
                                        <button
                                            type='submit'
                                            className='btn btn-primary rounded-pill custom-register-btn mx-auto w-75'
                                            disabled={forgotPasswordLoading}>
                                            Send OTP
                                        </button>
                                    </div>
                                    <div className='text-center'>
                                        <Link
                                            to='/signin'
                                            className='small text-decoration-none'>
                                            Go back to Login Page?
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
