import { Nav, Image } from "react-bootstrap";
import {
    FaUser,
    FaShoppingBag,
    FaWallet,
    FaMapMarkerAlt,
    FaGift,
    FaUserTimes,
    FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authUserSlice";
import { Link, useNavigate } from "react-router-dom";
import "./profileNav.css";

function ProfileNav() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await dispatch(logoutUser()).unwrap();
            navigate("/", { replace: true });
        } catch (err) {
            console.log("logout error", err);
        }
    };
    return (
        <div>
            <section className='profile-nav p-3 rounded'>
                <div className='profile-header d-flex align-items-center p-3 mb-3 rounded bg-dark text-white'>
                    <Image
                        src={user?.avatar || "/images/hero/default-avatar.webp"}
                        roundedCircle
                        className='me-2 user-nav-img'
                    />
                    <span className='profile-name'>{`Hello, ${user?.name}`}</span>
                </div>

                <Nav className='flex-column'>
                    <Nav.Link className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm' as={Link} to='/profile'>
                        <FaUser className='me-3 icon' /> Profile
                    </Nav.Link>
                    <Nav.Link className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm' as={Link} to='/orders'>
                        <FaShoppingBag className='me-3 icon' /> My Orders
                    </Nav.Link>
                    <Nav.Link className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm'>
                        <FaWallet className='me-3 icon' /> Wallet
                    </Nav.Link>
                    <Nav.Link className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm' as={Link} to='/address'>
                        <FaMapMarkerAlt className='me-3 icon' /> Address
                    </Nav.Link>
                    <Nav.Link className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm'>
                        <FaGift className='me-3 icon' /> Refer & Earn
                    </Nav.Link>
                    <Nav.Link className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm text-danger'>
                        <FaUserTimes className='me-3 icon' /> Delete Account
                    </Nav.Link>
                    <button
                        className='profile-cell d-flex align-items-center mb-3 p-3 rounded shadow-sm'
                        onClick={handleLogout}>
                        <FaSignOutAlt className='me-3 icon' /> Logout
                    </button>
                </Nav>
            </section>
        </div>
    );
}

export default ProfileNav;
