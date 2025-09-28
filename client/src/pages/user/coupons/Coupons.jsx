//user coupons
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import "./coupons.css";
import { useSelector, useDispatch } from "react-redux";
import {
    getUserCoupons,
    applyCoupon,
} from "../../../features/coupons/couponSlice";
import { useNavigate } from "react-router-dom";

const Coupons = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { coupons } = useSelector((state) => state.coupon);

    const { totals } = useSelector((state) => state.cart);
    const cartTotal = totals.subtotal;

    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const toggleCoupon = (coupon) => {
        if (selectedCoupon?._id === coupon._id) {
            setSelectedCoupon(null);
        } else {
            setSelectedCoupon(coupon);
        }
    };

    const handleApplyCoupon = async (couponCode) => {
        try {
            await dispatch(applyCoupon({ couponCode, cartTotal })).unwrap();
            navigate("/payment");
        } catch (err) {
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cartTotal > 0) {
            dispatch(getUserCoupons(cartTotal));
        }
    }, [dispatch, cartTotal]);

    return (
        <>
            <UserHeader />
            <section className='coupons container'>
                <div className='p-4 shadow rounded bg-white'>
                    <h3 className='text-center mb-4'>Available Coupons</h3>

                    <div className='coupon-list'>
                        {coupons.map((coupon) => (
                            <Card
                                key={coupon._id}
                                className={`mb-2 coupon-item ${
                                    coupon.usageLimit > 0
                                        ? "active"
                                        : "inactive"
                                } ${
                                    selectedCoupon?._id === coupon._id
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    coupon.usageLimit > 0 &&
                                    toggleCoupon(coupon)
                                }>
                                <Card.Body className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <Card.Title>
                                            {coupon.couponName}
                                        </Card.Title>
                                        <Card.Text className='text-success'>
                                            {coupon.couponCode}
                                        </Card.Text>
                                        <Card.Text>
                                            EXP:{" "}
                                            {new Date(
                                                coupon.expirationDate
                                            ).toDateString()}
                                        </Card.Text>
                                    </div>
                                    {coupon.isActive && (
                                        <div className='coupon-toggle'>
                                            {selectedCoupon?._id === coupon._id
                                                ? "-"
                                                : "+"}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </div>

                    <div className='d-flex justify-content-between mt-4'>
                        <Button
                            variant='secondary'
                            onClick={() => navigate("/payment")}>
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            disabled={!selectedCoupon}
                            onClick={() =>
                                handleApplyCoupon(selectedCoupon.couponCode)
                            }>
                            Apply
                        </Button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Coupons;
