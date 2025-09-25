//user view order page
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import PaginationButton from "../../../components/Pagination";
import { Row, Col, Card, Button } from "react-bootstrap";
import "./orders.css";
import { useSelector, useDispatch } from "react-redux";
import { getOrderItem, getOrders } from "../../../features/orders/orderSlice";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "../../../utils/confirmAlert";

const ViewDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orders, loadingByAction, currentPage, totalPages } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        dispatch(getOrders({ page: currentPage }));
        window.scrollTo(0, 0);
    }, [dispatch, currentPage]);

    const handlePageChange = (page) => {
        dispatch(getOrders({ page }));
    };

    const handleCancelClick = async ({ orderId, productId }) => {
        const confirmed = await confirmAlert(
            "Cancel the Order?",
            "Are you sure you want to cancel this order?",
            "Confirm",
            "Cancel"
        );

        if (confirmed) {
            try {
                await dispatch(getOrderItem({ orderId, productId })).unwrap();
                navigate(`/cancel/order/${orderId}/${productId}`);
            } catch (err) {
            }
        }
    };

    const handleReturnClick = async ({ orderId, productId }) => {
        const confirmed = await confirmAlert(
            "Return the Order?",
            "Are you sure you want to return this order?",
            "Confirm",
            "Cancel"
        );

        if (confirmed) {
            try {
                await dispatch(getOrderItem({ orderId, productId })).unwrap();
                navigate(`/return/order/${orderId}/${productId}`);
            } catch (err) {
            }
        }
    };

    const statusColors = {
        PLACED: "success",
        SHIPPED: "success",
        "OUT FOR DELIVERY": "success",
        DELIVERED: "success",
        CANCELLED: "danger",
        RETURNED: "danger",
        REFUNDED: "primary",
    };

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
            {loadingByAction.getOrders && <LoadingSpinner />}
            <UserHeader />
            <section className='viewOrder container py-4'>
                <h3 className='mb-4 container'>My Orders</h3>

                {orders.length === 0 ? (
                    <div className='text-center py-5'>
                        <h5>No orders found</h5>
                        <p className='text-muted'>
                            Looks like you haven't ordered anything yet.
                        </p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className='mb-5 order-wrapper container'>
                            <h5 className='mb-3'>
                                Order No: {order.orderNumber}
                            </h5>

                            {order.cartItems?.map((item) => (
                                <Row
                                    key={item._id}
                                    className='mb-4 d-flex align-items-start justify-content-between'>
                                    <Col xs={12} md={9}>
                                        <Card
                                            className='p-2 order-card border-0'
                                            onClick={() =>
                                                navigate(
                                                    `/order/detail/${order._id}/${item.productId}`
                                                )
                                            }>
                                            <Row className='align-items-center'>
                                                <Col
                                                    xs={4}
                                                    sm={3}
                                                    className='text-center'>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className='order-img img-fluid'
                                                    />
                                                </Col>
                                                <Col xs={8} sm={9}>
                                                    <h6>{item.name}</h6>
                                                    <p className='mb-1'>
                                                        Size:{" "}
                                                        {item.selectedSize}
                                                    </p>
                                                    <strong>
                                                        ₹{item.price}
                                                    </strong>
                                                    <p
                                                        className={`mb-2 mt-2 text-${
                                                            statusColors[
                                                                item.status
                                                            ]
                                                        }`}>
                                                        Order{" "}
                                                        {item.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            item.status
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </p>

                                                    {item.status ===
                                                        "PLACED" && (
                                                        <Button
                                                            variant='danger'
                                                            size='md'
                                                            className='fw-semibold rounded-pill'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCancelClick(
                                                                    {
                                                                        orderId:
                                                                            order._id,
                                                                        productId:
                                                                            item.productId,
                                                                    }
                                                                );
                                                            }}>
                                                            Cancel Order
                                                        </Button>
                                                    )}

                                                    {item.status ===
                                                        "DELIVERED" && (
                                                        <Button
                                                            variant='primary'
                                                            size='md'
                                                            className='fw-semibold rounded-pill'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReturnClick(
                                                                    {
                                                                        orderId:
                                                                            order._id,
                                                                        productId:
                                                                            item.productId,
                                                                    }
                                                                );
                                                            }}>
                                                            Return Order
                                                        </Button>
                                                    )}

                                                    {(item.status ===
                                                        "CANCELLED" ||
                                                        item.status ===
                                                            "RETURNED" ||
                                                        item.status ===
                                                            "REFUNDED") && (
                                                        <Link
                                                            to={`/user/productDetail/${item.productId}`}
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            className='btn btn-success fw-semibold rounded-pill'>
                                                            Order Again
                                                        </Link>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>

                                    <Col
                                        xs={12}
                                        md={3}
                                        className='mt-3 mt-md-0'>
                                        <div className='timeline'>
                                            {getTimelineSteps(item.status).map(
                                                (step, index, steps) => {
                                                    const historyStep =
                                                        item.statusHistory?.find(
                                                            (s) =>
                                                                s.status ===
                                                                step
                                                        );
                                                    const stepDate =
                                                        historyStep?.date;

                                                    const isActive =
                                                        item.status === step;

                                                    const isCompleted =
                                                        historyStep &&
                                                        !isActive &&
                                                        steps.indexOf(
                                                            item.status
                                                        ) > index;

                                                    const isFinalStatus = [
                                                        "CANCELLED",
                                                        "RETURNED",
                                                        "REFUNDED",
                                                    ].includes(item.status);

                                                    let dotClass = "pending";
                                                    if (
                                                        item.status ===
                                                            "REFUNDED" &&
                                                        (step === "RETURNED" ||
                                                            step === "REFUNDED")
                                                    ) {
                                                        dotClass = "refunded";
                                                    } else if (
                                                        isFinalStatus &&
                                                        step === item.status
                                                    ) {
                                                        dotClass =
                                                            item.status.toLowerCase();
                                                    } else if (isCompleted) {
                                                        dotClass = "completed";
                                                    } else if (isActive) {
                                                        dotClass =
                                                            item.status ===
                                                            "DELIVERED"
                                                                ? "delivered"
                                                                : "active";
                                                    }

                                                    let lineClass = "pending";
                                                    if (
                                                        item.status ===
                                                            "REFUNDED" &&
                                                        step === "RETURNED"
                                                    ) {
                                                        lineClass = "refunded";
                                                    } else if (
                                                        isFinalStatus &&
                                                        step === item.status
                                                    ) {
                                                        lineClass =
                                                            item.status.toLowerCase();
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
                                                                steps.length -
                                                                    1 && (
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
                            ))}
                        </div>
                    ))
                )}

                {orders.length > 0 && (
                    <PaginationButton
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>

            <Footer />
        </>
    );
};

export default ViewDetail;
