// admin sideNav
import { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import {
    BsList,
    BsGraphUp,
    BsBag,
    BsCardList,
    BsBarChart,
    BsPeople,
    BsTicket,
    BsGrid,
    BsCollection,
    BsPersonPlus,
} from "react-icons/bs";
import "./adminSidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../features/auth/authAdminSlice";
import { MdAdminPanelSettings } from "react-icons/md";
import LoadingSpinner from "../LoadingSpinner";
import { confirmAlert } from "../../utils/confirmAlert";

const sidebarItems = [
    {
        icon: <BsGraphUp size={20} />,
        text: "Dashboard",
        path: "/admin/dashboard",
    },
    { icon: <BsBag size={20} />, text: "Order", path: "/admin/orders" },
    {
        icon: <BsCardList size={20} />,
        text: "Products",
        path: "/admin/products",
    },
    {
        icon: <BsBarChart size={20} />,
        text: "Sales report",
        path: "/admin/sales/report",
    },
    {
        icon: <BsPeople size={20} />,
        text: "Customer",
        path: "/admin/customers",
    },
    { icon: <BsTicket size={20} />, text: "Coupon", path: "/admin/coupons" },
    { icon: <BsGrid size={20} />, text: "Category", path: "/admin/categories" },
    {
        icon: <BsCollection size={20} />,
        text: "Banners",
        path: "/admin/banner",
    },
    {
        icon: <BsPersonPlus size={20} />,
        text: "Referrals",
        path: "/admin/referrals",
    },
];

const SidebarContent = ({
    closeMenu,
    handleLogoutClick,
    getAdminLoading,
    navigate,
}) => (
    <div className='sidebar-content d-flex flex-column justify-content-between align-items-center py-4 container'>
        {/* Title */}
        <div className='px-3 py-4 logo-head'>
            <img
                src='/images/admin-Logo.webp'
                alt='adminLogo'
                className='img-fluid'
            />
        </div>

        {/* Menu Items */}
        <div>
            {sidebarItems.map((item, idx) => (
                <div
                    key={idx}
                    className='d-flex align-items-center px-3 py-2 mb-2 sidebar-item'
                    onClick={() => {
                        navigate(item.path);
                        if (closeMenu) closeMenu();
                    }}>
                    {item.icon}
                    <span className='ms-2'>{item.text}</span>
                </div>
            ))}
        </div>

        {/* Sign Out Button */}
        <div className='px-3 mt-3 w-100'>
            <Button
                variant='danger'
                className='w-100 rounded-3 fw-semibold fs-6'
                onClick={handleLogoutClick}
                disabled={getAdminLoading}>
                Sign Out
            </Button>
        </div>
    </div>
);

export default function Sidebar() {
    const { loadingByAction } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getAdminLoading = loadingByAction?.adminLogout;

    const handleAdminLogout = async () => {
        try {
            await dispatch(adminLogout()).unwrap();
            navigate("/admin/signin");
        } catch (err) {
            alert("Failed to logout. Please try again.");
        }
    };

    const handleLogoutClick = async () => {
        const confirmed = await confirmAlert(
            "Logout the account?",
            "Are you sure you want to logout the account",
            "Logout",
            "Cancel"
        );

        if (confirmed) {
            handleAdminLogout();
        }
    };

    const [show, setShow] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 992;
            setIsDesktop(desktop);
            if (desktop) setShow(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {getAdminLoading && <LoadingSpinner />}
            {!isDesktop && (
                <div className='p-3 position-absolute top-0 start-0 z-3'>
                    <Button variant='light' onClick={() => setShow(true)}>
                        <BsList size={28} />
                    </Button>
                </div>
            )}

            {isDesktop && (
                <div className='sidebar d-flex flex-column border-end'>
                    <SidebarContent
                        handleLogoutClick={handleLogoutClick}
                        getAdminLoading={getAdminLoading}
                        navigate={navigate}
                    />
                </div>
            )}

            {!isDesktop && (
                <Offcanvas
                    show={show}
                    onHide={() => setShow(false)}
                    placement='start'>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            <MdAdminPanelSettings size={24} />
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='p-0'>
                        <SidebarContent
                            closeMenu={() => setShow(false)}
                            handleLogoutClick={handleLogoutClick}
                            navigate={navigate}
                            getAdminLoading={getAdminLoading}
                        />
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </>
    );
}
