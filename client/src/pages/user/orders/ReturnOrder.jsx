import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Image } from "react-bootstrap";
import "./orders.css";
import { useSelector, useDispatch } from "react-redux";
import { getOrderItem, returnOrder } from "../../../features/orders/orderSlice";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ReturnOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderId, productId } = useParams();
    const { loadingByAction, orderItem } = useSelector((state) => state.order);

    useEffect(() => {
        if (!loadingByAction.getOrderItem) {
            window.scrollTo(0, 0);
        }
    }, [loadingByAction.getOrderItem]);

    useEffect(() => {
        dispatch(getOrderItem({ orderId, productId }));
    }, [dispatch, orderId, productId]);

    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const reasons = [
        "Damaged packaging",
        "Wrong product received",
        "Packaging tampered with or opened",
        "Product expired or near expiry",
        "Other",
    ];

    const handleSelectReason = (reason) => {
        setSelectedReason(reason);
        if (reason !== "Other") setCustomReason("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reasonToSend =
            selectedReason === "Other" ? customReason : selectedReason;
        if (!reasonToSend) return;
        try {
            await dispatch(
                returnOrder({ orderId, productId, reason: reasonToSend })
            ).unwrap();
            navigate("/view/order", {replace: true});
        } catch (err) {
            console.log("order cancel error", err);
        }
    };

    return (
        <>
            {loadingByAction.getOrderItem && <LoadingSpinner />}
            <UserHeader />
            <section className='cancel-order container'>
                <div className='cancel-order-card p-4 rounded'>
                    <Row>
                        {/* Left Side - Product Details */}
                        <Col md={4} className='text-center mb-4 mb-md-0'>
                            {orderItem && (
                                <div key={orderItem._id}>
                                    <Image
                                        src={orderItem.image}
                                        alt={orderItem.name}
                                        className='img-fluid rounded'
                                        style={{ maxHeight: "220px" }}
                                    />
                                    <h5 className='fw-bold mt-3'>
                                        {orderItem.name}
                                    </h5>
                                    <p className='text-muted mb-1'>
                                        Size: {orderItem.selectedSize}
                                    </p>
                                    <p className='text-muted mb-1'>
                                        Quantity: {orderItem.quantity}
                                    </p>
                                    <p className='fw-semibold fs-5'>
                                        ₹{orderItem.price}
                                    </p>
                                </div>
                            )}
                        </Col>

                        {/* Right Side - Reason Selection */}
                        <Col md={8}>
                            <Form onSubmit={handleSubmit}>
                                <div className='d-flex flex-column mb-4 gap-2'>
                                    {reasons.map((reason, index) => (
                                        <div
                                            key={index}
                                            className={`reason-checkbox p-3 rounded border ${
                                                selectedReason === reason
                                                    ? "border-dark bg-light"
                                                    : "border-secondary"
                                            }`}
                                            onClick={() =>
                                                handleSelectReason(reason)
                                            }
                                            style={{ cursor: "pointer" }}>
                                            <Form.Check
                                                type='checkbox'
                                                label={reason}
                                                checked={
                                                    selectedReason === reason
                                                }
                                                readOnly
                                            />
                                        </div>
                                    ))}
                                </div>

                                {selectedReason === "Other" && (
                                    <Form.Group className='mb-4'>
                                        <Form.Label className='fw-semibold'>
                                            Description
                                        </Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows={4}
                                            placeholder='Write your reason here...'
                                            value={customReason}
                                            onChange={(e) =>
                                                setCustomReason(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                )}

                                <div className='d-flex justify-content-center gap-3'>
                                    <Button
                                        type='button'
                                        onClick={() => navigate("/view/order")}
                                        variant='outline-dark'
                                        className='px-4 py-2'>
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='dark'
                                        className='px-5 py-2'
                                        disabled={
                                            !selectedReason ||
                                            (selectedReason === "Other" &&
                                                !customReason)
                                        }>
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ReturnOrders;
