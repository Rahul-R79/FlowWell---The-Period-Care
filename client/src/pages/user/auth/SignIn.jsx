import { Link } from 'react-router-dom';
import './auth.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, signinUser } from '../../../features/auth/authUserSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';

function SignIn() {
	const {user, loadingByAction, errorByAction} = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const signInLoading = loadingByAction.signinUser;

	const [showPassword, setShowPassword] = useState(false);
	const togglePassword = () => setShowPassword(prev => !prev);

	const apiUrl = import.meta.env.VITE_API_URL;

	const [formData, setFormData] = useState({
		email: '', 
		password: ''
	});

	const handleData = (e)=>{
		setFormData({...formData, [e.target.name] : e.target.value});
	}

	const handleSignIn = async (e)=>{
		e.preventDefault();
		try{
			await dispatch(signinUser(formData)).unwrap();
			navigate('/');
		}catch(err){
			console.log('signin error', err);
		}
	}

	useEffect(()=>{
		dispatch(clearErrors());
	}, [dispatch]);

	const getFieldError = (fieldName)=>{
		return errorByAction.signinUser?.find(e => e.field === fieldName)?.message;
	};
	
	return (
		<>
		{signInLoading && <LoadingSpinner/>}
		<div className="min-vh-100 d-flex align-items-center justify-content-center text-white px-3 py-4 authForm">
			<div className="container">
				<div className="row shadow-lg rounded-4 overflow-hidden bg-transparent">
					
					{/* Left Image Section */}
					<div className="col-lg-6 bg-white d-flex align-items-center justify-content-center">
						<div className="w-100 px-3 text-center">
							<h4 className="fw-bold text-dark mb-3 mt-3 text-flowwell">FlowWell</h4>
							<img
								src="/images/hero/form_hero3.webp"
								alt="FlowWell menstrual gift hamper"
								className="img-fluid rounded-4 hero-img"
							/>
						</div>
					</div>

					{/* Right Form Section */}
					<div className="col-lg-6 p-4 d-flex align-items-center justify-content-center right-form">
						<div className="w-100 my-auto">
							<h2 className="fw-semibold mb-3">Sign in</h2>
							<p className="text-light small mb-4">
								Don't have an account?
								<Link to="/signup" className="text-primary text-decoration-none"> Register here!</Link>
							</p>

							<form noValidate onSubmit={handleSignIn}>
								<div className='mb-3'>
									{getFieldError('general') && <small className='text-danger'>{getFieldError('general')}</small>}
								</div>
								{/* Email */}
								<div className="mb-3">
									<label htmlFor="email" className="form-label small text-light">Email</label>
									<div className="input-group">
										<span className="input-group-text bg-transparent border-0 text-white">
											<i className="bi bi-envelope" />
										</span>
										<input
											type="email"
											id="email"
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
										<button
											type="button"
											className="btn position-absolute end-0 top-50 translate-middle-y text-secondary p-0 eye-button"
											aria-label="Toggle password visibility"
											onClick={togglePassword}
										>
											<i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"} />
										</button>
									</div>
									{getFieldError('password') && <small className='text-danger'>{getFieldError('password')}</small>}
								</div>
                                <div className="mb-5 text-end">
                                    <Link to='/forgotpassword' className="text-primary mb-0 small text-decoration-none">
                                        Forgot Password
                                    </Link>
                                </div>
								{/* Login Button */}
								<div className="d-grid mb-4">
									<button type="submit" className="btn btn-primary rounded-pill custom-register-btn mx-auto w-75">
										Login
									</button>
								</div>

								{/* Google Sign-In */}
								<div className="text-center text-light mb-3 small">Continue with</div>
								<div className="d-grid">
									<button type="button" onClick={() => window.location.href = `${apiUrl}/api/auth/google`}
									className="btn btn-light d-flex align-items-center justify-content-center gap-2 px-3 py-3 rounded mx-auto google-btn">
										<img
											src="/images/icons/google_icon.webp"
											alt="Google"
											width="20"
											height="20"
										/>
										<span className="fw-medium google-text">Signin with Google</span>
									</button>
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

export default SignIn;
