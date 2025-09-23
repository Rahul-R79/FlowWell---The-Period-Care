//otp verification
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, resendOTP } from "../features/auth/authUserSlice";
import {
    verifyForgotOTP,
    resendForgotOTP,
} from "../features/auth/authUserSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

function OtpVerification() {
    const { user, loadingByAction, errorByAction } = useSelector(
        (state) => state.auth
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const flow = queryParams.get("flow");

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [resendDisabled, setresendDisabled] = useState(true);
    const inputRef = useRef([]);
    const intervalRef = useRef(null);

    const isVerifying =
        flow === "signup"
            ? loadingByAction.verifyOTP
            : loadingByAction.verifyForgotOTP;

    const isResending =
        flow === "signup"
            ? loadingByAction.resendOTP
            : loadingByAction.resendForgotOTP;

    const loading = isVerifying || isResending;

    const email =
        flow === "signup"
            ? localStorage.getItem("otpEmail")
            : localStorage.getItem("forgotMail");

    const setOtpStartTime = () => {
        localStorage.setItem(`otpStartTime_${flow}`, Date.now());
    };

    const startTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        setTimer(60);
        setresendDisabled(true);
        setOtpStartTime();

        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    setresendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        const storedStartTime = localStorage.getItem(`otpStartTime_${flow}`);
        let initialTime = 60;

        if (storedStartTime) {
            const seconds = Math.floor(
                (Date.now() - parseInt(storedStartTime)) / 1000
            );
            initialTime = Math.max(0, 60 - seconds);

            setTimer(initialTime);
            setresendDisabled(initialTime > 0);

            if (initialTime > 0) {
                intervalRef.current = setInterval(() => {
                    setTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(intervalRef.current);
                            setresendDisabled(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } else {
            startTimer();
        }
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRef.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const joinOTP = otp.join("");
            if (joinOTP.length === 4 && email) {
                if (flow === "signup") {
                    await dispatch(verifyOTP({ email, otp: joinOTP })).unwrap();
                    localStorage.removeItem("otpEmail");
                    navigate("/signin", { replace: true });
                } else {
                    await dispatch(
                        verifyForgotOTP({ email, otp: joinOTP })
                    ).unwrap();
                    navigate("/forgotpassword2", { replace: true });
                }
                localStorage.removeItem(`otpStartTime_${flow}`);
                clearInterval(intervalRef.current);
            }
        } catch (err) {
            alert("OTP verification failed. Please try again.");
        }
    };

    const handleResend = async () => {
        try {
            if (flow === "signup") {
                await dispatch(resendOTP({ email })).unwrap();
            } else {
                await dispatch(resendForgotOTP({ email })).unwrap();
            }
            startTimer();
        } catch (err) {
            alert("Resend OTP failed. Please try again.");
        }
    };

    const getFiledErrorOfVerify = (fieldName) => {
        if (flow === "signup") {
            return errorByAction.verifyOTP?.find((e) => e.field === fieldName)
                ?.message;
        } else {
            return errorByAction.verifyForgotOTP?.find(
                (e) => e.field === fieldName
            )?.message;
        }
    };

    const getFiledErrorOfResend = (fieldName) => {
        if (flow === "signup") {
            return errorByAction.resendOTP?.find((e) => e.field === fieldName)
                ?.message;
        } else {
            return errorByAction.resendForgotOTP?.find(
                (e) => e.field === fieldName
            )?.message;
        }
    };
    return (
        <>
            {loading && <LoadingSpinner />}
            <div className='min-vh-100 d-flex align-items-center justify-content-center bg-black px-2 py-4'>
                <div className='container'>
                    <div className='row shadow-lg overflow-hidden rounded-4 bg-dark text-white'>
                        <div className='col-lg-6 d-lg-block p-0 position-relative'>
                            <h4 className='flowwellname'>FlowWell</h4>
                            <img
                                src='/images/hero/form_hero2.webp'
                                alt='FlowWell menstrual product'
                                className='img-fluid h-100 w-100 object-fit-cover'
                            />
                        </div>

                        <div className='col-lg-6 p-5 d-flex align-items-center justify-content-center right-form'>
                            <div className='w-100 confrim-otp'>
                                <h4 className='mb-3 fw-semibold'>
                                    Confirm with OTP
                                </h4>
                                <p className='mb-4 small text-light'>
                                    Please check your mail address for OTP
                                </p>
                                {getFiledErrorOfVerify("general") && (
                                    <small className='text-danger'>
                                        {getFiledErrorOfVerify("general")}
                                    </small>
                                )}
                                {getFiledErrorOfResend("general") && (
                                    <small className='text-danger'>
                                        {getFiledErrorOfResend("general")}
                                    </small>
                                )}
                                {/* OTP Inputs */}
                                <div className='d-flex gap-2 justify-content-between mb-4 mt-4'>
                                    {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            type='text'
                                            maxLength={1}
                                            className='form-control text-center otp-input'
                                            value={value}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleBackspace(e, index)
                                            }
                                            ref={(element) =>
                                                (inputRef.current[index] =
                                                    element)
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Timer and Resend */}
                                <div className='d-flex justify-content-between mb-3 small'>
                                    <span className='text-light'>
                                        Remaining Time:{" "}
                                        <span className='text-primary'>
                                            {timer}
                                        </span>
                                    </span>
                                    <button
                                        type='button'
                                        className='btn btn-link p-0 text-decoration-none text-primary'
                                        onClick={handleResend}
                                        disabled={resendDisabled || loading}>
                                        Resend OTP
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <div className='d-grid mb-4'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary rounded-pill py-2'
                                        onClick={handleSubmit}
                                        disabled={
                                            loading || otp.join("").length < 4
                                        }>
                                        Send OTP
                                    </button>
                                </div>

                                {/* Back to Login */}
                                <div className='text-center'>
                                    <Link
                                        to={
                                            flow === "signup"
                                                ? "/signup"
                                                : "/forgotpassword"
                                        }
                                        className='small text-decoration-none'>
                                        {flow === "signup"
                                            ? "Go back to SingUp Page?"
                                            : "Go back to Forgot Password?"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OtpVerification;
