// import '../index.css';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, resendOTP } from '../features/auth/authSlice';
import { useNavigate,  Link} from 'react-router-dom';
import { useRef, useState } from 'react';

function OtpVerification() {
	const {user, loading, errorByAction} = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [otp, setOtp] = useState(['', '', '', '']);
	const [timer, setTimer] = useState(60);
	const inputRef = useRef([]);

	const email = localStorage.getItem('otpEmail');

	const handleChange = (index, value)=>{
		if(!/^[0-9]?$/.test(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if(value && index<3){
			inputRef.current[index + 1]?.focus();
		}
	}
	
	const handleBackspace = (e, index)=>{
		if(e.key === 'Backspace' && !otp[index] && index > 0){
			inputRef.current[index - 1]?.focus();
		}
	}	

	const handleSubmit = async(e)=>{
		e.preventDefault();
		try{
			const joinOTP = otp.join('');
			if(joinOTP.length === 4 && email){
				await dispatch(verifyOTP({email, otp: joinOTP})).unwrap();
				navigate('/signin');
			}
		}catch(err){
			console.log('otp verification error', err)
		}
	}

	const getFiledError = (fieldName)=>{
		return errorByAction.verifyOTP?.find(e => e.field === fieldName)?.message;
	}

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-black px-2 py-4">
		<div className="container">
			<div className="row shadow-lg overflow-hidden rounded-4 bg-dark text-white">
			
			<div className="col-lg-6 d-lg-block p-0 position-relative">
				<h4 className="flowwellname">FlowWell</h4>
				<img
				src="/images/hero/form_hero2.webp"
				alt="FlowWell menstrual product"
				className="img-fluid h-100 w-100 object-fit-cover"
				/>
			</div>

			<div className="col-lg-6 p-5 d-flex align-items-center justify-content-center right-form">
				<div className="w-100 confrim-otp">
				<h4 className="mb-3 fw-semibold">Confirm with OTP</h4>
				<p className="mb-4 small text-light">Please check your mail address for OTP</p>
				{getFiledError ('general') && <small className='text-danger'>{getFiledError ('general')}</small>}
				{/* OTP Inputs */}
				<div className="d-flex gap-2 justify-content-between mb-4 mt-4">
					{otp.map((value, index)=> (
						<input key={index} 
						type="text" 
						maxLength={1} 
						className="form-control text-center otp-input" 
						value={value}
						onChange={(e)=> handleChange(index, e.target.value)}
						onKeyDown={(e)=> handleBackspace(e, index)}
						ref={(element)=> (inputRef.current[index] = element)}
						/>
					))}
				</div>

				{/* Timer and Resend */}
				<div className="d-flex justify-content-between mb-3 small">
					<span className="text-light">Remaining Time: <span className="text-primary">49s</span></span>
					<button type="button" className="btn btn-link p-0 text-decoration-none text-primary">Resend OTP</button>
				</div>

				{/* Submit Button */}
				<div className="d-grid mb-4">
					<button type="submit" className="btn btn-primary rounded-pill py-2" 
						onClick={handleSubmit} 
						disabled={loading || otp.join('').length < 4}
					>
						{loading ? 'Verifying...': 'Send OTP'}
					</button>
				</div>

				{/* Back to Login */}
				<div className="text-center">
					<Link to="/signin" className="small text-decoration-none">
						Go back to Login Page?
					</Link>
				</div>
				</div>
			</div>

			</div>
		</div>
		</div>
	);
}

export default OtpVerification;
