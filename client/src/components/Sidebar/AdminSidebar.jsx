import { useState, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import {BsList, BsGraphUp, BsBag, BsCardList, BsBarChart, BsPeople, BsTicket, BsGrid, BsArrowRepeat, BsCollection, BsPersonPlus} from 'react-icons/bs';
import './adminSidebar.css';

const sidebarItems = [
    { icon: <BsGraphUp size={20} />, text: 'Dashboard' },
    { icon: <BsBag size={20} />, text: 'Order' },
    { icon: <BsCardList size={20} />, text: 'Products' },
    { icon: <BsBarChart size={20} />, text: 'Sales report' },
    { icon: <BsPeople size={20} />, text: 'Customer' },
    { icon: <BsTicket size={20} />, text: 'Coupon' },
    { icon: <BsGrid size={20} />, text: 'Category' },
    { icon: <BsArrowRepeat size={20} />, text: 'Refund/Return' },
    { icon: <BsCollection size={20} />, text: 'Banners' },
    { icon: <BsPersonPlus size={20} />, text: 'Referrals' },
];

const SidebarContent = ({ closeMenu }) => (
    <div className="sidebar-content d-flex flex-column justify-content-between align-items-center py-4 container">
        {/* Logo / Title */}
        <div className="px-3 mb-4 py-4 logo-head">
            <h1 className="fs-3 fw-bold m-0">FlowWell</h1>
        </div>

        {/* Menu Items */}
        <div>
            {sidebarItems.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center px-3 py-2 mb-2 sidebar-item" onClick={closeMenu}>
                    {item.icon}
                    <span className="ms-2">{item.text}</span>
                </div>
            ))}
        </div>

        {/* Sign Out Button */}
        <div className="px-3 mt-3 w-100">
            <Button variant="danger" className="w-100 rounded-3 fw-semibold fs-6">
                Sign Out
            </Button>
        </div>
    </div>
);

export default function Sidebar() {
    const [show, setShow] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992); 

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 992);
            if(window.innerWidth >= 992) {
                setShow(false);
            }
        };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
        {!isDesktop && (
            <div className="p-3 border-bottom">
                <Button variant="light" onClick={() => setShow(true)}>
                    <BsList size={28} />
                </Button>
            </div>
        )}

        {isDesktop && (
            <div className="sidebar d-flex flex-column border-end">
                <SidebarContent />
            </div>
        )}

        {!isDesktop && (
            <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <BsGrid size={24} />
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0">
                    <SidebarContent closeMenu={() => setShow(false)} />
                </Offcanvas.Body>
            </Offcanvas>
        )}
        </>
    );
}
