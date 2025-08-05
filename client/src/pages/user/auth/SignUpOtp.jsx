import './auth.css';
import { Link } from 'react-router-dom';

function SignUpOtp() {
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

              {/* OTP Inputs */}
              <div className="d-flex gap-2 justify-content-between mb-4">
                <input type="text" maxLength={1} className="form-control text-center otp-input" />
                <input type="text" maxLength={1} className="form-control text-center otp-input" />
                <input type="text" maxLength={1} className="form-control text-center otp-input" />
                <input type="text" maxLength={1} className="form-control text-center otp-input" />
              </div>

              {/* Timer and Resend */}
              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-light">Remaining Time: <span className="text-primary">49s</span></span>
                <button type="button" className="btn btn-link p-0 text-decoration-none text-primary">Resend OTP</button>
              </div>

              {/* Submit Button */}
              <div className="d-grid mb-4">
                <button type="submit" className="btn btn-primary rounded-pill py-2">
                  Send OTP
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

export default SignUpOtp;
