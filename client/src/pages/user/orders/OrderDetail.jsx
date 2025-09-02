import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Card, Button } from "react-bootstrap";
import "./orders.css";
import { useSelector, useDispatch } from "react-redux";
import { getOrders, getOrderItem } from "../../../features/orders/orderSlice";
import { getAllAddresses } from "../../../features/addressSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const OrderDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderId, productId } = useParams();
    const { orderItem, orders, loadingByAction } = useSelector(
        (state) => state.order
    );
    const { addresses } = useSelector((state) => state.address);

    useEffect(() => {
        dispatch(getOrders({ limit: 1000 }));
        dispatch(getOrderItem({ orderId, productId }));
        dispatch(getAllAddresses());
        window.scrollTo(0, 0);
    }, [dispatch, orderId, productId]);

    const currentOrder = orders.find((o) => o._id === orderId);
    const shippingAddress = addresses.find(
        (addr) => addr._id === currentOrder?.shippingAddress
    );

    const fullTimeline = ["PLACED", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"];
    const statusMessages = {
        PLACED: "Your order has been placed on",
        SHIPPED: "Your order has been shipped on",
        "OUT FOR DELIVERY": "Your order is out for delivery since",
        DELIVERED: "Your order was delivered on",
        CANCELLED: "Your order was cancelled on",
        RETURNED: "Your order was returned on",
        REFUNDED: "Refund completed on",
    };

    const getTimelineSteps = (status) => {
        if (status === "CANCELLED") {
            return ["PLACED", "CANCELLED"];
        }

        if (status === "RETURNED") {
            return [...fullTimeline, "RETURNED"];
        }

        if (status === "REFUNDED") {
            return [...fullTimeline, "RETURNED", "REFUNDED"];
        }

        return fullTimeline;
    };

    return (
        <>
            {loadingByAction.getOrderItem && <LoadingSpinner />}
            <UserHeader />
            <section className='order-detail container py-4'>
                <h3 className='mb-4'>Order Details</h3>
                {!orderItem ? (
                    <div className='text-center py-5'>
                        <h4 className='mb-3'>No Product Found</h4>
                        <p className='text-muted'>
                            The order details are not available at the moment.
                        </p>
                    </div>
                ) : (
                    <>
                        <Row className='mb-5'>
                            {/* Left: Product Detail */}
                            <Col md={6}>
                                <Card className='p-3 shadow-sm border-0 mb-5'>
                                    <Row>
                                        <Col xs={4}>
                                            <img
                                                src={orderItem.image}
                                                alt={orderItem.name}
                                                className='img-fluid order-img'
                                            />
                                        </Col>
                                        <Col xs={8}>
                                            <h5>{orderItem.name}</h5>
                                            <p className='text-muted mb-1'>
                                                Size: {orderItem.selectedSize}
                                            </p>
                                            <p className='text-muted mb-1'>
                                                Quantity: {orderItem.quantity}
                                            </p>
                                            <h6 className='fw-bold mb-5'>
                                                ₹{orderItem.price}
                                            </h6>
                                            {orderItem.status ===
                                            "DELIVERED" ? (
                                                <Button className='btn btn-info text-light'>
                                                    Add Review
                                                </Button>
                                            ) : (
                                                <Button
                                                    className='btn btn-success text-light'
                                                    onClick={() =>
                                                        navigate(
                                                            `/user/productdetail/${orderItem.productId}`,
                                                            { replace: true }
                                                        )
                                                    }>
                                                    Order Again
                                                </Button>
                                            )}
                                        </Col>
                                        <Col md={12} className='text-end'>
                                            <Button
                                                variant='secondary'
                                                className='me-2'
                                                onClick={() =>
                                                    window.open(
                                                        `http://localhost:3000/api/user/orders/${orderId}/invoice?download=false`,
                                                        "_blank"
                                                    )
                                                }>
                                                View Invoice
                                            </Button>
                                            <Button
                                                variant='primary'
                                                onClick={() =>
                                                    window.open(
                                                        `http://localhost:3000/api/user/orders/${orderId}/invoice?download=true`,
                                                        "_blank"
                                                    )
                                                }>
                                                Download Invoice
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            {/* Right: Timeline */}
                            <Col
                                md={6}
                                className='d-flex justify-content-center'>
                                <div className='timeline'>
                                    {getTimelineSteps(orderItem.status).map(
                                        (step, index, steps) => {
                                            const historyStep =
                                                orderItem.statusHistory?.find(
                                                    (s) => s.status === step
                                                );
                                            const stepDate = historyStep?.date;

                                            const isActive =
                                                orderItem.status === step;
                                            const isCompleted =
                                                historyStep &&
                                                !isActive &&
                                                steps.indexOf(
                                                    orderItem.status
                                                ) > index;

                                            const isCancelled =
                                                orderItem.status ===
                                                "CANCELLED";
                                            const isReturned =
                                                orderItem.status === "RETURNED";
                                            const isRefunded =
                                                orderItem.status === "REFUNDED";

                                            let dotClass = "pending";

                                            if (
                                                isCancelled &&
                                                step === "CANCELLED"
                                            ) {
                                                dotClass = "cancelled";
                                            } else if (
                                                isReturned &&
                                                step === "RETURNED"
                                            ) {
                                                dotClass = "returned";
                                            } else if (
                                                isRefunded &&
                                                (step === "RETURNED" ||
                                                    step === "REFUNDED")
                                            ) {
                                                dotClass = "refunded";
                                            } else if (isCompleted) {
                                                dotClass = "completed";
                                            } else if (isActive) {
                                                dotClass =
                                                    orderItem.status ===
                                                    "DELIVERED"
                                                        ? "delivered"
                                                        : "active";
                                            }

                                            let lineClass = "pending";

                                            if (
                                                isCancelled &&
                                                step === "PLACED"
                                            ) {
                                                lineClass = "cancelled";
                                            } else if (
                                                isReturned &&
                                                step === "DELIVERED"
                                            ) {
                                                lineClass = "returned";
                                            } else if (
                                                isRefunded &&
                                                step === "RETURNED"
                                            ) {
                                                lineClass = "refunded";
                                            } else if (
                                                isCompleted ||
                                                isActive
                                            ) {
                                                lineClass = "completed";
                                            }

                                            return (
                                                <div
                                                    key={index}
                                                    className='timeline-item'>
                                                    <div
                                                        className={`timeline-dot ${dotClass}`}></div>
                                                    {index !==
                                                        steps.length - 1 && (
                                                        <div
                                                            className={`timeline-line ${lineClass}`}></div>
                                                    )}
                                                    <div className='timeline-content'>
                                                        <h6>{step}</h6>
                                                        {stepDate && (
                                                            <small>
                                                                {
                                                                    statusMessages[
                                                                        step
                                                                    ]
                                                                }
                                                                ,{" "}
                                                                {new Date(
                                                                    stepDate
                                                                ).toDateString()}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </Col>
                        </Row>

                        {/* Bottom: Summary & Address */}
                        <Row>
                            <Col md={6}>
                                <Card className='p-3 shadow-sm border-0 mb-5'>
                                    <h6 className='mb-3'>Price details</h6>
                                    <Row>
                                        <Col>Actual Price</Col>
                                        <Col className='text-end'>
                                            ₹{currentOrder?.subtotal}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>Discount</Col>
                                        <Col className='text-end'>
                                            ₹{currentOrder?.discount}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>Delivery Fee</Col>
                                        <Col className='text-end'>
                                            ₹{currentOrder?.deliveryFee}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col className='fw-bold'>
                                            Total Amount
                                        </Col>
                                        <Col className='fw-bold text-end'>
                                            ₹{currentOrder?.total}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className='p-3 shadow-sm border-0'>
                                    <h6 className='mb-3'>Shipping details</h6>
                                    {shippingAddress ? (
                                        <>
                                            <p className='mb-1 fw-bold'>
                                                {shippingAddress.fullName}
                                            </p>
                                            <p className='mb-1'>
                                                {shippingAddress.streetAddress},{" "}
                                                {shippingAddress.locality}
                                            </p>
                                            <p className='mb-1'>
                                                {shippingAddress.city},{" "}
                                                {shippingAddress.state}
                                            </p>
                                            <p className='mb-1'>
                                                PIN: {shippingAddress.pincode}
                                            </p>
                                        </>
                                    ) : (
                                        <p className='text-muted'>
                                            Address not found
                                        </p>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </section>

            <Footer />
        </>
    );
};

export default OrderDetail;
