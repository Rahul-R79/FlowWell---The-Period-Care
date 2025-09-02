import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Image, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./orders.css";
import PaginationButton from "../../../components/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../../../features/orders/orderSlice";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AllOrders = () => {
    const dispatch = useDispatch();
    const { loadingByAction, orders, currentPage, totalPages } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        dispatch(getOrders({ page: currentPage }));
        window.scrollTo(0, 0);
    }, [dispatch, currentPage]);

    const handlePageChange = (page) => {
        dispatch(getOrders({ page }));
    };

    const statusColors = {
        PLACED: "success",
        SHIPPED: "success",
        "OUT FOR DELIVERY": "success",
        DELIVERED: "primary",
        CANCELLED: "danger",
        RETURNED: "danger",
    };

    return (
        <>
            {loadingByAction.getOrders && <LoadingSpinner />}
            <UserHeader />
            <section className='orders container'>
                <div className='p-4'>
                    <h3 className='mb-4'>Orders</h3>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        orders?.map((order) => (
                            <div
                                key={order._id}
                                className='order-item p-3 mb-3 border rounded'>
                                <h6 className='mb-2'>
                                    Order #{order.orderNumber}
                                </h6>

                                {order?.cartItems.map((item) => (
                                    <Row
                                        key={item._id}
                                        className='align-items-center mb-3'>
                                        <Col
                                            md={4}
                                            className='d-flex align-items-center'>
                                            <Image
                                                src={item?.image}
                                                alt={item.name}
                                                className='order-img me-3'
                                            />
                                            <div>
                                                <h6 className='mb-1'>
                                                    {item.name}
                                                </h6>
                                                <p className='mb-1 text-muted'>
                                                    Size: {item.selectedSize}
                                                </p>
                                                <p className='mb-1 text-muted'>
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                        </Col>

                                        <Col md={2} className='text-center'>
                                            <h5 className='mb-0'>
                                                ₹{item.price}
                                            </h5>
                                        </Col>
                                    </Row>
                                ))}
                                <div className='order-status'>
                                    <div className='order-status'>
                                        <p
                                            className={`mb-0 fw-bold text-${
                                                statusColors[order.orderStatus]
                                            }`}>
                                            Order{" "}
                                            {order.orderStatus
                                                .charAt(0)
                                                .toUpperCase() +
                                                order.orderStatus
                                                    .slice(1)
                                                    .toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                                <Row>
                                    <Col
                                        md={12}
                                        className='text-md-end text-start'>
                                        <p className='mb-1 fw-semibold'>
                                            Expected Delivery:{" "}
                                            {new Date(
                                                order.expectedDelivery
                                            ).toDateString()}
                                        </p>
                                        <Link className='p-0 text-decoration-none view-link fw-bold' to={'/view/order'}>
                                            VIEW DETAILS
                                        </Link>
                                    </Col>
                                </Row>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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

export default AllOrders;
