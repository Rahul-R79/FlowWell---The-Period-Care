import { useNavigate, Link } from 'react-router-dom';
import { resetForgotPassword } from '../../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

function ForgotPassword2() {
	const {loading, errorByAction} = useSelector(state => state.auth);
	const [formData, setFormData] = useState({newPassword: '', newConfirmPassword: ''});
	const dispatch = useDispatch();
	const navigate = useNavigate()

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePassword = () => setShowPassword(prev => !prev);
	const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

	const email = localStorage.getItem('forgotMail');

	const handleData = (e)=>{
		setFormData({...formData, [e.target.name] : e.target.value});
	}

	const handleSubmit = async(e)=>{
		e.preventDefault();
		try{
			await dispatch(resetForgotPassword({email, formData})).unwrap();
			localStorage.removeItem('forgotMail');
			navigate('/signin');
		}catch(err){
			console.log('change forgotpassword error', err);
		}
	}

	const getFieldError = (fieldName)=>{
		return errorByAction.resetForgotPassword?.find(e => e.field === fieldName)?.message;
	}
	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center text-white px-3 py-4 authForm">
			<div className="container">
				<div className="row shadow-lg rounded-4 overflow-hidden bg-transparent">
					
					<div className="col-lg-6 d-lg-block p-0 position-relative">
                        <h4 className="flowwellname">FlowWell</h4>
                        <img
                        src="/images/hero/form-hero4.webp"
                        alt="FlowWell menstrual product"
                        className="img-fluid h-100 w-100 object-fit-cover"
                        />
                    </div>

					{/* Right Form Section */}
					<div className="col-lg-6 p-5 d-flex align-items-center justify-content-center right-form">
						<div className="w-100 my-auto">
							<h2 className="fw-semibold mb-4">Forgot Password</h2>
							<p className="text-light mb-4">
								Please Enter your new Password
							</p>

							<form noValidate onSubmit={handleSubmit}>
								{/* new password */}
								<div className="mb-5 position-relative">
									<label htmlFor="newPassword" className="form-label small text-light">New Password</label>
									<div className="input-group">
										<span className="input-group-text bg-transparent border-0 text-white">
											<i className="bi bi-lock" />
										</span>
										<input
											type={showPassword ? "text" : "password"}
											id="newPassword"
											className="form-control text-light bg-transparent"
											placeholder="Enter your Password"
											name='newPassword'
											onChange={handleData}
											required
										/>
										<button
											type="button"
											className="btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button"
											aria-label="Toggle password visibility"
											onClick={togglePassword}
										>
											<i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash" }/>
										</button>
									</div>
									{getFieldError('newPassword') && <small className='text-danger'>{getFieldError('newPassword')}</small>}
								</div>
								{/*confirm Password */}
								<div className="mb-5 position-relative">
									<label htmlFor="confirmPassword" className="form-label small text-light">Confirm Password</label>
									<div className="input-group">
										<span className="input-group-text bg-transparent border-0 text-white">
											<i className="bi bi-lock" />
										</span>
										<input
											type={showConfirmPassword ? "text" : "password"}
											id="confirmPassword"
											className="form-control text-light bg-transparent"
											placeholder="Enter your Password"
											name='newConfirmPassword'
											onChange={handleData}
											required
										/>
										<button
											type="button"
											className="btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button"
											aria-label="Toggle password visibility"
											onClick={toggleConfirmPassword}
										>
											<i className={showConfirmPassword ? "bi bi-eye" : "bi bi-eye-slash" }/>
										</button>
									</div>
									{getFieldError('newConfirmPassword') && <small className='text-danger'>{getFieldError('newConfirmPassword')}</small>}
								</div>
								<div className="d-grid mb-4">
									<button type="submit" className="btn btn-primary rounded-pill custom-register-btn mx-auto w-75">
										Change Password
									</button>
								</div>
                                <div className="text-center">
                                        <Link to="/signin" className="small text-decoration-none">
                                        	Go back to Login Page?
                                        </Link>
                                </div>
							</form>
						</div>
					</div>
					
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword2;
