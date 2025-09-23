//user change password
import { useNavigate, Link } from "react-router-dom";
import { changePassword } from "../../../features/auth/authUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { clearErrors } from "../../../features/auth/authUserSlice";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

function ChangePassword() {
    const { loadingByAction, errorByAction } = useSelector(
        (state) => state.auth
    );
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setshowNewPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleNewPassword = () => setshowNewPassword((prev) => !prev);

    const handleData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(changePassword(formData)).unwrap();
            navigate("/", { replace: true });
        } catch (err) {
            alert('change password error');
        }
    };

    const getFieldError = (fieldName) => {
        return errorByAction.changePassword?.find((e) => e.field === fieldName)
            ?.message;
    };

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);
    return (
        <>
            {loadingByAction.changePassword && <LoadingSpinner />}
            <div className='min-vh-100 d-flex align-items-center justify-content-center text-white px-3 py-4 authForm'>
                <div className='container'>
                    <div className='row shadow-lg rounded-4 overflow-hidden bg-transparent'>
                        <div className='col-lg-6 d-lg-block p-0 position-relative'>
                            <h4 className='flowwellname'>FlowWell</h4>
                            <img
                                src='/images/hero/form-hero4.webp'
                                alt='FlowWell menstrual product'
                                className='img-fluid h-100 w-100 object-fit-cover'
                            />
                        </div>

                        {/* Right Form Section */}
                        <div className='col-lg-6 p-5 d-flex align-items-center justify-content-center right-form'>
                            <div className='w-100 my-auto'>
                                <h2 className='fw-semibold mb-4'>
                                    Change Password
                                </h2>
                                <p className='text-light mb-4'>
                                    Please Enter your new Password
                                </p>

                                <form noValidate onSubmit={handleSubmit}>
                                    {/* new password */}
                                    <div className='mb-5 position-relative'>
                                        <label
                                            htmlFor='oldPassword'
                                            className='form-label small text-light'>
                                            Old Password
                                        </label>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-transparent border-0 text-white'>
                                                <i className='bi bi-lock' />
                                            </span>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id='oldPassword'
                                                className='form-control text-light bg-transparent'
                                                placeholder='Enter your old Password'
                                                name='oldPassword'
                                                value={formData.oldPassword}
                                                onChange={handleData}
                                                required
                                            />
                                            <button
                                                type='button'
                                                className='btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button'
                                                aria-label='Toggle password visibility'
                                                onClick={togglePassword}>
                                                <i
                                                    className={
                                                        showPassword
                                                            ? "bi bi-eye"
                                                            : "bi bi-eye-slash"
                                                    }
                                                />
                                            </button>
                                        </div>
                                        {getFieldError("oldPassword") && (
                                            <small className='text-danger'>
                                                {getFieldError("oldPassword")}
                                            </small>
                                        )}
                                    </div>
                                    {/*confirm Password */}
                                    <div className='mb-5 position-relative'>
                                        <label
                                            htmlFor='newPassword'
                                            className='form-label small text-light'>
                                            New Password
                                        </label>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-transparent border-0 text-white'>
                                                <i className='bi bi-lock' />
                                            </span>
                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id='newPassword'
                                                className='form-control text-light bg-transparent'
                                                placeholder='Enter your new Password'
                                                name='newPassword'
                                                value={formData.newPassword}
                                                onChange={handleData}
                                                required
                                            />
                                            <button
                                                type='button'
                                                className='btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button'
                                                aria-label='Toggle password visibility'
                                                onClick={toggleNewPassword}>
                                                <i
                                                    className={
                                                        showNewPassword
                                                            ? "bi bi-eye"
                                                            : "bi bi-eye-slash"
                                                    }
                                                />
                                            </button>
                                        </div>
                                        {getFieldError("newPassword") && (
                                            <small className='text-danger'>
                                                {getFieldError("newPassword")}
                                            </small>
                                        )}
                                    </div>
                                    <div className='d-grid mb-4'>
                                        <button
                                            type='submit'
                                            className='btn btn-primary rounded-pill custom-register-btn mx-auto w-75'>
                                            Change Password
                                        </button>
                                    </div>
                                    <div className='text-center'>
                                        <Link
                                            to='/'
                                            className='small text-decoration-none'>
                                            Go back to Home Page?
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

export default ChangePassword;
