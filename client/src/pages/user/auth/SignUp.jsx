import './auth.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signupUser } from '../../../features/auth/authSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
	const { user, loading, errorByAction } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePassword = () => setShowPassword(prev => !prev);
	const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const handleData = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		try{
			await dispatch(signupUser(formData)).unwrap();
			localStorage.setItem('otpEmail', formData.email);
			localStorage.setItem('otpTimeStart', Date.now().toString())
			navigate('/otpverification');
		}catch(err){
			console.log('signup failed', err);
		}
	};

	const getFieldError = (fieldName) => {
		return errorByAction.signupUser?.find(e => e.field === fieldName)?.message;
	};

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center text-white py-4 px-3 signUp">
			<div className="container">
				<div className="row shadow-lg rounded-4 overflow-hidden bg-transparent">
					<div className="col-lg-6 bg-white d-flex align-items-center justify-content-center">
						<div className="w-100 px-3 text-center">
							<h4 className="fw-bold text-dark mb-3 mt-3 text-flowwell">FlowWell</h4>
							<img src="/images/hero/form-hero7.webp"
								alt="FlowWell menstrual gift hamper"
								className="img-fluid rounded-4 hero-img" />
						</div>
					</div>
					<div className="col-lg-6 p-4 right-form">
						<h2 className="fw-semibold mb-3">Sign up</h2>
						<p className="text-light small mb-4">Already have an account?
							<Link to='/signin' className="text-primary text-decoration-none"> Login here!</Link>
						</p>
						<form noValidate onSubmit={handleSignUp}>
							<div className='mb-3'>
								{getFieldError('general') && <small className='text-danger'>{getFieldError('general')}</small>}
							</div>

							{/* Username */}
							<div className="mb-3">
								<label htmlFor="username" className="form-label small text-light">Username</label>
								<div className="input-group">
									<span className="input-group-text bg-transparent border-0 text-white">
										<i className="bi bi-person" />
									</span>
									<input type="text" id="username"
										className="form-control text-light bg-transparent"
										placeholder="Enter your User name"
										name='name'
										value={formData.name}
										onChange={handleData}
										required
									/>
								</div>
								{getFieldError('name') && <small className='text-danger'>{getFieldError('name')}</small>}
							</div>

							{/* Email */}
							<div className="mb-3">
								<label htmlFor="email" className="form-label small text-light">Email</label>
								<div className="input-group">
									<span className="input-group-text bg-transparent border-0 text-white">
										<i className="bi bi-envelope" />
									</span>
									<input type="email" id="email"
										className="form-control text-light bg-transparent"
										placeholder="Enter your email address"
										name='email'
										value={formData.email}
										onChange={handleData}
										required
									/>
								</div>
								{getFieldError('email') && <small className='text-danger'>{getFieldError('email')}</small>}
							</div>

							{/* Password */}
							<div className="mb-3 position-relative">
								<label htmlFor="password" className="form-label small text-light">Password</label>
								<div className="input-group">
									<span className="input-group-text bg-transparent border-0 text-white">
										<i className="bi bi-lock" />
									</span>
									<input
										type={showPassword ? 'text' : 'password'}
										id="password"
										className="form-control text-light bg-transparent"
										placeholder="Enter your Password"
										name='password'
										value={formData.password}
										onChange={handleData}
										required
									/>
									<button type="button"
										className="btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button"
										onClick={togglePassword}
									>
										<i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"} />
									</button>
								</div>
								{getFieldError('password') && <small className='text-danger'>{getFieldError('password')}</small>}
							</div>

							{/* Confirm Password */}
							<div className="mb-5 position-relative">
								<label htmlFor="confirmPassword" className="form-label small text-light">Confirm Password</label>
								<div className="input-group">
									<span className="input-group-text bg-transparent border-0 text-white">
										<i className="bi bi-lock" />
									</span>
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										id="confirmPassword"
										className="form-control text-light bg-transparent"
										placeholder="Confirm your Password"
										name='confirmPassword'
										value={formData.confirmPassword}
										onChange={handleData}
										required
									/>
									<button type="button"
										className="btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button"
										onClick={toggleConfirmPassword}
									>
										<i className={showConfirmPassword ? "bi bi-eye" : "bi bi-eye-slash"} />
									</button>
								</div>
								{getFieldError('confirmPassword') && <small className='text-danger'>{getFieldError('confirmPassword')}</small>}
							</div>

							{/* Register Button */}
							<div className="d-grid mb-4">
								<button type="submit" className="btn btn-primary rounded-pill custom-register-btn mx-auto w-75" disabled={loading}>
									{loading ? 'Registering...' : 'Register'}
								</button>
							</div>

							{/* Google Sign-In */}
							<div className="text-center text-light mb-3 small">Continue with</div>
							<div className="d-grid">
								<button type="button" className="btn btn-light d-flex align-items-center justify-content-center gap-2 px-3 py-3 rounded mx-auto google-btn">
									<img src="/images/icons/google_icon.webp"
										alt="Google"
										width="20"
										height="20"
									/>
									<span className="fw-medium google-text">Sign in with Google</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignUp;
