import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Card, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./review.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderItem } from "../../../features/orders/orderSlice";
import { addReview, clearErrors } from "../../../features/reviewSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ToastNotification, {showErrorToast, showSuccessToast} from "../../../components/ToastNotification";

const AddReviews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderItem } = useSelector((state) => state.order);
    const { errorByAction, loadingByAction } = useSelector((state) => state.review);
    const {user} = useSelector((state)=> state.auth)
    const { orderId, productId } = useParams();

    const [hover, setHover] = useState(null);
    const [formData, setFormData] = useState({ rating: 0, heading: "", description: "" });

    const handleData = (e) => {
        const value = e.target.name === "rating" ? Number(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const getFieldErrors = (fieldName) => {
        return errorByAction.addReview?.find((e) => e.field === fieldName)?.message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                addReview({
                    formData,
                    orderId,
                    productId,
                    userId: user._id
                })
            ).unwrap();
            showSuccessToast('Review Added Successfully');
            setTimeout(() => {
                navigate(`/user/productdetail/${productId}`, {replace: true});
            }, 600);
            setFormData({ rating: 0, heading: "", description: "" });
        } catch (err) {
            showErrorToast(err.find((e)=> e.field === 'general')?.message || 'add review error');
        }
    };

    useEffect(() => {
        dispatch(getOrderItem({ orderId, productId }));
        dispatch(clearErrors());
    }, [dispatch, orderId, productId]);

    return (
        <>
            {loadingByAction.addReview && <LoadingSpinner/>}
            <UserHeader />
            <ToastNotification/>
            <section className="reviews container py-4">
                <h3 className="mb-5">Add Review</h3>

                <Card className="shadow-sm">
                    <Card.Body>
                        {/* Product Info */}
                        {!orderItem ? (
                            <p className="text-muted">Loading product details...</p>
                        ) : (
                            <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                                <img
                                    src={orderItem.image}
                                    alt={orderItem.name}
                                    className="rounded me-3 review-img"
                                />
                                <div>
                                    <h5 className="mb-1">{orderItem.name}</h5>
                                    <p className="mb-1 text-muted">
                                        Size: {orderItem.selectedSize} | Qty: {orderItem.quantity}
                                    </p>
                                    <p className="fw-bold mb-0">₹ {orderItem.price}</p>
                                </div>
                            </div>
                        )}

                        {/* Review Form */}
                        <Form onSubmit={handleSubmit}>
                            {/* Rating */}
                            <div className="mb-3">
                                <label className="form-label">Your Rating</label>
                                <div>
                                    {[...Array(5)].map((star, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <label key={ratingValue}>
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    checked={formData.rating === ratingValue}
                                                    value={ratingValue}
                                                    onChange={handleData}
                                                    style={{ display: "none" }}
                                                />
                                                <FaStar
                                                    size={28}
                                                    color={
                                                        ratingValue <= (hover || formData.rating)
                                                            ? "#ffc107"
                                                            : "#e4e5e9"
                                                    }
                                                    onMouseEnter={() => setHover(ratingValue)}
                                                    onMouseLeave={() => setHover(null)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                                {getFieldErrors("rating") && (
                                    <small className="text-danger">{getFieldErrors("rating")}</small>
                                )}
                            </div>

                            {/* Heading */}
                            <Form.Group className="mb-3">
                                <Form.Label>Review Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter a short headline"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleData}
                                    
                                />
                                {getFieldErrors("heading") && (
                                    <small className="text-danger">{getFieldErrors("heading")}</small>
                                )}
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className="mb-3">
                                <Form.Label>Review Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Write your detailed review..."
                                    name="description"
                                    value={formData.description}
                                    onChange={handleData}
                                />
                                {getFieldErrors("description") && (
                                    <small className="text-danger">{getFieldErrors("description")}</small>
                                )}
                            </Form.Group>

                            {/* Buttons */}
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="outline-secondary" onClick={()=> navigate(`/order/detail/${orderId}/${productId}`)}>Cancel</Button>
                                <Button
                                    variant="dark"
                                    type="submit"
                                    disabled={loadingByAction.addReview}
                                >
                                    Add Review
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </section>
            <Footer />
        </>
    );
};

export default AddReviews;
