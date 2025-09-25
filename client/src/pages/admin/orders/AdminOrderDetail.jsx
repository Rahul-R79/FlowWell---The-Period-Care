//admin order detail
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
    adminGetOrderDetail,
    adminUpdateOrderStatus,
} from "../../../features/orders/adminOrderSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { confirmAlert } from "../../../utils/confirmAlert";

const AdminOrdersDetail = () => {
    const dispatch = useDispatch();
    const { orderId } = useParams();
    const { orderDetail, loadingByAction } = useSelector(
        (state) => state.adminOrder
    );

    useEffect(() => {
        if (orderId) {
            dispatch(adminGetOrderDetail(orderId));
        }
    }, [dispatch, orderId]);

    const handleStatusClick = async ({ productId, newStatus }) => {
        const confirmed = await confirmAlert(
            "Change the Status?",
            "Are you sure you want to Change the status?",
            "Confirm",
            "Cancel"
        );

        if (confirmed) {
            try {
                await dispatch(
                    adminUpdateOrderStatus({
                        orderId: orderDetail._id,
                        productId,
                        newStatus,
                    })
                ).unwrap();
                dispatch(adminGetOrderDetail(orderDetail._id));
            } catch (err) {
            }
        }
    };

    return (
        <>
            {(loadingByAction.adminGetOrderDetail ||
                loadingByAction.adminUpdateOrderStatus) && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='container py-4'>
                        <h4 className='mb-4 text-center text-lg-start'>
                            Order Details
                        </h4>
                    </div>

                    {/* admin order detail card */}
                    <div className='flex-grow-1 container mb-5'>
                        <Row className='g-4'>
                            {orderDetail?.cartItems.map((item) => (
                                <Col lg={8} key={item._id}>
                                    <Card className='p-3 shadow-sm'>
                                        <Row>
                                            <Col md={4} className='text-center'>
                                                <img
                                                    src={item?.image}
                                                    alt={item.name}
                                                    className='img-fluid rounded'
                                                />
                                            </Col>
                                            <Col md={8}>
                                                <h5>{item.name}</h5>
                                                <p className='mb-1'>
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className='mb-1'>
                                                    Selected Size:{" "}
                                                    {item.selectedSize}
                                                </p>
                                                <p className='mb-1'>
                                                    Price: ₹{item.price}
                                                </p>
                                                <p className='mb-1'>
                                                    Status:{" "}
                                                    <Button
                                                        size='sm'
                                                        variant={
                                                            item.status ===
                                                            "PLACED"
                                                                ? "outline-success"
                                                                : item.status ===
                                                                  "SHIPPED"
                                                                ? "outline-info"
                                                                : item.status ===
                                                                  "DELIVERED"
                                                                ? "success"
                                                                : item.status ===
                                                                      "CANCELLED" ||
                                                                  item.status ===
                                                                      "RETURNED"
                                                                ? "outline-danger"
                                                                : item.status ===
                                                                  "OUT FOR DELIVERY"
                                                                ? "outline-dark"
                                                                : "outline-primary"
                                                        }
                                                        disabled>
                                                        {item.status}
                                                    </Button>
                                                </p>

                                                <h6 className='mt-3'>
                                                    Change Status:
                                                </h6>
                                                <div className='d-flex flex-wrap gap-2'>
                                                    {/* Shipped */}
                                                    {item.status ===
                                                        "PLACED" && (
                                                        <Button
                                                            variant='outline-info'
                                                            disabled={
                                                                loadingByAction?.adminUpdateOrderStatus
                                                            }
                                                            onClick={() =>
                                                                handleStatusClick(
                                                                    {
                                                                        productId:
                                                                            item._id,
                                                                        newStatus:
                                                                            "SHIPPED",
                                                                    }
                                                                )
                                                            }>
                                                            Shipped
                                                        </Button>
                                                    )}

                                                    {/* Out for Delivery */}
                                                    {item.status ===
                                                        "SHIPPED" && (
                                                        <Button
                                                            variant='outline-dark'
                                                            disabled={
                                                                loadingByAction?.adminUpdateOrderStatus
                                                            }
                                                            onClick={() =>
                                                                handleStatusClick(
                                                                    {
                                                                        productId:
                                                                            item._id,
                                                                        newStatus:
                                                                            "OUT FOR DELIVERY",
                                                                    }
                                                                )
                                                            }>
                                                            Out for Delivery
                                                        </Button>
                                                    )}

                                                    {/* Delivered */}
                                                    {item.status ===
                                                        "OUT FOR DELIVERY" && (
                                                        <Button
                                                            variant='outline-success'
                                                            disabled={
                                                                loadingByAction?.adminUpdateOrderStatus
                                                            }
                                                            onClick={() =>
                                                                handleStatusClick(
                                                                    {
                                                                        productId:
                                                                            item._id,
                                                                        newStatus:
                                                                            "DELIVERED",
                                                                    }
                                                                )
                                                            }>
                                                            Delivered
                                                        </Button>
                                                    )}

                                                    {/* Cancel */}
                                                    {item.status !==
                                                        "DELIVERED" &&
                                                        item.status !==
                                                            "CANCELLED" &&
                                                        item.status !==
                                                            "RETURNED" &&
                                                        item.status !==
                                                            "REFUNDED" && (
                                                            <Button
                                                                variant='outline-danger'
                                                                disabled={
                                                                    loadingByAction?.adminUpdateOrderStatus
                                                                }
                                                                onClick={() =>
                                                                    handleStatusClick(
                                                                        {
                                                                            productId:
                                                                                item._id,
                                                                            newStatus:
                                                                                "CANCELLED",
                                                                        }
                                                                    )
                                                                }>
                                                                Cancel Order
                                                            </Button>
                                                        )}

                                                    {/* Refund completion */}
                                                    {item.status ===
                                                        "RETURNED" && (
                                                        <Button
                                                            variant='outline-primary'
                                                            disabled={
                                                                loadingByAction?.adminUpdateOrderStatus
                                                            }
                                                            onClick={() =>
                                                                handleStatusClick(
                                                                    {
                                                                        productId:
                                                                            item._id,
                                                                        newStatus:
                                                                            "REFUNDED",
                                                                    }
                                                                )
                                                            }>
                                                            Refund Completed
                                                        </Button>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}

                            <Col lg={4}>
                                {/* Shipping Details */}
                                <Card className='mb-3 p-3 shadow-sm'>
                                    <h6 className='fw-bold mb-2'>
                                        Shipping Details
                                    </h6>
                                    <p className='mb-1 fw-semibold'>
                                        {orderDetail?.shippingAddress?.fullName}
                                    </p>
                                    <p className='mb-0'>
                                        {
                                            orderDetail?.shippingAddress
                                                ?.streetAddress
                                        }
                                        , <br />
                                        {
                                            orderDetail?.shippingAddress?.city
                                        }, {orderDetail?.shippingAddress?.state}{" "}
                                        -{" "}
                                        {orderDetail?.shippingAddress?.pincode}
                                    </p>
                                </Card>

                                {/* Price Details */}
                                <Card className='p-3 shadow-sm'>
                                    <h6 className='fw-bold mb-2'>
                                        Price Details
                                    </h6>
                                    <div className='d-flex justify-content-between mb-1'>
                                        <span>Subtotal</span>
                                        <span>₹{orderDetail?.subtotal}</span>
                                    </div>
                                    <div className='d-flex justify-content-between mb-1'>
                                        <span>Discount</span>
                                        <span>
                                            - ₹
                                            {orderDetail?.discount +
                                                orderDetail?.couponDiscount}
                                        </span>
                                    </div>
                                    <div className='d-flex justify-content-between mb-1'>
                                        <span>Delivery Fee</span>
                                        {orderDetail?.deliveryFee !== 0 ? (
                                            <span>
                                                ₹{orderDetail?.deliveryFee}
                                            </span>
                                        ) : (
                                            <span className='text-success'>
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    <div className='d-flex justify-content-between fw-bold'>
                                        <span>Total</span>
                                        <span>₹{orderDetail?.total}</span>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default AdminOrdersDetail;
