//product detail page
import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Image,
    Tabs,
    Tab,
    Accordion,
    Card,
} from "react-bootstrap";
import UserHeader from "../../../components/Header/UserHeader";
import Footer from "../../../components/Footer/UserFooter";
import "./userProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { getUserProductById } from "../../../features/products/userProductSlice";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} from "../../../features/wishlistSlice";
import { addToCart } from "../../../features/cartSlice";
import ToastNotification, {
    showErrorToast,
    showSuccessToast,
} from "../../../components/ToastNotification";
import {
    getReviewsByProduct,
    getReviewSummary,
} from "../../../features/reviewSlice";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { Toast, ToastContainer } from "react-bootstrap";

function ProductDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");

    const { productDetail, loadingByAction, similarProducts } = useSelector(
        (state) => state.userProducts
    );
    const { productReviews, reviewSummary } = useSelector(
        (state) => state.review
    );

    const [showSummaryToast, setShowSummaryToast] = useState(false);
    const [showSummaryPopup, setShowSummaryPopup] = useState(false);

    useEffect(() => {
        setShowSummaryToast(false);
        setShowSummaryPopup(false);

        if (reviewSummary && reviewSummary !== "No reviews available yet.") {
            setShowSummaryToast(true);
        }
    }, [id, reviewSummary]);

    const { wishlist } = useSelector((state) => state.wishlist);
    const { loadingByAction: cartLoading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserProductById(id));
        dispatch(getReviewsByProduct(id));
        dispatch(getReviewSummary(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    useEffect(() => {
        if (productDetail?.sizes?.length > 0) {
            const firstAvailableSize = productDetail.sizes.find(
                (s) => s.stock > 0
            );
            setSelectedSize(
                firstAvailableSize ? firstAvailableSize.size : null
            );
        }

        if (productDetail?.images?.length > 0) {
            setSelectedImage(productDetail.images[0]);
        }
    }, [productDetail]);

    const isInWishlist = productDetail?._id
        ? wishlist.products?.some(
              (item) => item.product._id === productDetail._id
          )
        : false;

    const handleWishlistToggle = async () => {
        try {
            if (!user) {
                navigate("/signup");
                return;
            }
            if (!isInWishlist) {
                await dispatch(
                    addToWishlist({
                        productId: productDetail._id,
                        selectedSize,
                    })
                ).unwrap();
                showSuccessToast("Added to wishlist!");
            } else {
                await dispatch(
                    removeFromWishlist({
                        productId: productDetail._id,
                        page: 1,
                        limit: 3,
                    })
                ).unwrap();
                showErrorToast("Removed from wishlist!");
            }
            await dispatch(getWishlist({ page: 1, limit: 3 })).unwrap();
        } catch (err) {}
    };

    const handleAddToCart = async () => {
        try {
            if (!user) {
                navigate("/signup");
                return;
            } else {
                await dispatch(
                    addToCart({
                        productId: productDetail._id,
                        quantity,
                        selectedSize,
                    })
                ).unwrap();
                showSuccessToast("Product added to cart!");
                setTimeout(() => {
                    navigate("/cart");
                }, 400);
            }
        } catch (err) {}
    };

    const handleQuantity = (type) => {
        const selectedSizeObj = productDetail.sizes.find(
            (s) => s.size === selectedSize
        );
        const stockAvailable = selectedSizeObj?.stock || 0;

        if (type === "inc") {
            if (quantity < 5 && quantity < stockAvailable) {
                setQuantity((prev) => prev + 1);
            } else if (quantity >= stockAvailable) {
                showErrorToast(
                    `Only ${stockAvailable} items available in stock!`
                );
            } else {
                showErrorToast("Maximum 5 quantity allowed per product!");
            }
        }
        if (type === "dec" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <>
            {loadingByAction.getUserProductById && <LoadingSpinner />}
            <UserHeader />
            <section className='product-detail'>
                <Container className='py-5'>
                    <ToastNotification />
                    <Row>
                        {/* Left side - Product Images */}
                        <Col md={6} className='d-flex'>
                            <div className='d-flex flex-column me-3 product-thumbs'>
                                {productDetail?.images
                                    ?.slice(0, 3)
                                    .map((thumb, i) => (
                                        <Image
                                            key={i}
                                            src={thumb}
                                            thumbnail
                                            className='mb-2 thumb-img'
                                            onClick={() =>
                                                setSelectedImage(thumb)
                                            }
                                            style={{
                                                border:
                                                    selectedImage === thumb
                                                        ? "2px solid #000"
                                                        : "1px solid #ddd",
                                            }}
                                        />
                                    ))}
                            </div>
                            {/* Main Image with zoom */}
                            <div className='flex-grow-1 product-main'>
                                {selectedImage && (
                                    <InnerImageZoom
                                        src={selectedImage}
                                        zoomSrc={selectedImage}
                                        zoomType='hover'
                                        zoomPreload={true}
                                        zoomScale={0.5}
                                        alt={productDetail.name}
                                        className='product-main-img'
                                    />
                                )}
                            </div>
                        </Col>

                        {/* Right side - Product Info */}
                        <Col md={6}>
                            <h3 className='fw-bold'>{productDetail?.name}</h3>

                            {/* Reviews Summary */}
                            <div className='d-flex align-items-center mb-2'>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <FaStar
                                        key={index}
                                        size={18}
                                        color={
                                            index <
                                            Math.round(
                                                productReviews.reduce(
                                                    (sum, r) => sum + r.rating,
                                                    0
                                                ) / productReviews.length
                                            )
                                                ? "#ffc107"
                                                : "#e4e5e9"
                                        }
                                    />
                                ))}
                                <span className='text-muted ms-2'>
                                    ({productReviews.length} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <h4 className='text-success fw-bold'>
                                ₹
                                {productDetail?.offer === "FLAT"
                                    ? productDetail.basePrice / 2
                                    : productDetail?.basePrice -
                                      (productDetail?.discountPrice || 0)}
                            </h4>

                            {/* Description */}
                            <p className='text-muted'>
                                {productDetail?.description}
                            </p>

                            {/* Size Selection */}
                            <div className='mb-3'>
                                <strong className='me-3'>Size:</strong>
                                {productDetail?.sizes.map((s, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            selectedSize === s.size
                                                ? "dark"
                                                : "outline-dark"
                                        }
                                        size='lg'
                                        className='me-2 position-relative'
                                        onClick={() =>
                                            s.stock > 0 &&
                                            setSelectedSize(s.size)
                                        }
                                        disabled={s.stock === 0}
                                        style={{
                                            textDecoration:
                                                s.stock === 0
                                                    ? "line-through"
                                                    : "none",
                                        }}>
                                        {s.size.length <= 3
                                            ? s.size.toUpperCase()
                                            : s.size.charAt(0).toUpperCase()}

                                        {s.stock === 0 && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "-8px",
                                                    right: "-8px",
                                                    background: "red",
                                                    color: "#fff",
                                                    fontSize: "10px",
                                                    padding: "2px 4px",
                                                    borderRadius: "4px",
                                                }}>
                                                Out
                                            </span>
                                        )}
                                    </Button>
                                ))}
                            </div>

                            {/* Quantity & Add to cart */}
                            <div className='d-flex align-items-center mb-3'>
                                {productDetail?.sizes.some(
                                    (s) => s.stock > 0
                                ) ? (
                                    <>
                                        <div className='quantity-selector d-flex align-items-center me-3'>
                                            <button
                                                className='qty-btn'
                                                onClick={() =>
                                                    handleQuantity("dec")
                                                }>
                                                -
                                            </button>
                                            <input
                                                type='text'
                                                value={quantity}
                                                readOnly
                                                className='qty-input text-center'
                                            />
                                            <button
                                                className='qty-btn'
                                                onClick={() =>
                                                    handleQuantity("inc")
                                                }>
                                                +
                                            </button>
                                        </div>

                                        <Button
                                            variant='dark'
                                            className='me-2'
                                            onClick={handleAddToCart}
                                            disabled={cartLoading.addToCart}>
                                            Add to cart
                                        </Button>
                                        <Button
                                            variant={
                                                isInWishlist
                                                    ? "danger"
                                                    : "outline-secondary"
                                            }
                                            onClick={handleWishlistToggle}>
                                            {isInWishlist
                                                ? "Remove from wishlist"
                                                : "♥ Add to wishlist"}
                                        </Button>
                                    </>
                                ) : (
                                    <h5 className='text-danger fw-bold'>
                                        Out of Stock
                                    </h5>
                                )}
                            </div>

                            {productDetail?.sizes
                                .filter(
                                    (s) =>
                                        s.size === selectedSize &&
                                        s.stock <= 2 &&
                                        s.stock > 0
                                )
                                .map((s) => (
                                    <h5 key={s.size} className='text-danger'>
                                        Hurry up, only {s.stock} left!
                                    </h5>
                                ))}

                            {/* Tabs */}
                            <Tabs
                                defaultActiveKey='details'
                                id='product-tabs'
                                className='mt-4'>
                                <Tab eventKey='details' title='Details'>
                                    <div className='pt-3'>
                                        <p>
                                            Soft cotton-feel top sheet,
                                            contoured wings, and absorbent
                                            multi-layer core for maximum
                                            protection.
                                        </p>

                                        {/* Accordion Section */}
                                        <Accordion alwaysOpen={false} flush>
                                            <Accordion.Item eventKey='0'>
                                                <Accordion.Header>
                                                    Selling Partner
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Flowell Official
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey='1'>
                                                <Accordion.Header>
                                                    Terms & Conditions
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Non-returnable item due to
                                                    hygiene concerns.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey='2'>
                                                <Accordion.Header>
                                                    How to Use
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Change pad every 4-6 hours.
                                                    Wrap used pad and dispose in
                                                    a bin. Do not flush.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </div>
                                </Tab>
                                <Tab eventKey='reviews' title='Reviews'>
                                    <div className='pt-3'>
                                        {loadingByAction.getReviewsByProduct ? (
                                            <p>Loading reviews...</p>
                                        ) : productReviews.length === 0 ? (
                                            <p className='text-muted'>
                                                No reviews yet..
                                            </p>
                                        ) : (
                                            productReviews.map((review) => (
                                                <Card
                                                    className='mb-3 shadow-sm'
                                                    key={review._id}>
                                                    <Card.Body>
                                                        {/* Rating */}
                                                        <div className='d-flex align-items-center mb-2'>
                                                            {[...Array(5)].map(
                                                                (_, index) => (
                                                                    <FaStar
                                                                        key={
                                                                            index
                                                                        }
                                                                        size={
                                                                            18
                                                                        }
                                                                        color={
                                                                            index <
                                                                            review.rating
                                                                                ? "#ffc107"
                                                                                : "#e4e5e9"
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </div>

                                                        <h5 className='fw-semi-bold mb-2'>
                                                            {review.heading}
                                                            <FaCheckCircle
                                                                className='text-success ms-2'
                                                                size={16}
                                                            />
                                                        </h5>

                                                        <p className='mb-3 text-muted'>
                                                            {review.description}
                                                        </p>

                                                        <p className='text-primary mb-0'>
                                                            {review.user?.name}
                                                        </p>

                                                        <small className='text-success'>
                                                            Posted On{" "}
                                                            {new Date(
                                                                review.createdAt
                                                            ).toDateString()}
                                                        </small>
                                                    </Card.Body>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </Tab>
                            </Tabs>
                        </Col>

                        {/* Similar Products */}
                        <div className='mt-5'>
                            <h5 className='mb-5'>
                                {similarProducts && similarProducts.length > 0
                                    ? "Similar Products"
                                    : "No Similar Products"}
                            </h5>
                            <Row className='g-3'>
                                {similarProducts.map((product, i) => (
                                    <Col xs={6} lg={3} key={i}>
                                        <div
                                            onClick={() =>
                                                navigate(
                                                    `/user/productdetail/${product._id}`
                                                )
                                            }
                                            style={{ cursor: "pointer" }}>
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className='img-fluid mb-2 similar-img'
                                            />
                                            <div className='similar-name'>
                                                {product.name}
                                            </div>
                                            <div className='similar-size'>
                                                Size:{" "}
                                                {product.sizes.map(
                                                    (s, index) => (
                                                        <span
                                                            key={index}
                                                            className='similar-size-btn'>
                                                            {s.size.length <= 3
                                                                ? s.size.toUpperCase()
                                                                : s.size
                                                                      .charAt(0)
                                                                      .toUpperCase()}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                            <div className='similar-price'>
                                                <del>₹{product.basePrice}</del>
                                            </div>
                                            <div className='similar-priceOg'>
                                                <span>
                                                    ₹
                                                    {product?.basePrice -
                                                        (product?.discountPrice ||
                                                            0)}
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Row>
                </Container>
                {/* review preview */}
                <ToastContainer
                    className='p-3'
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 1050,
                    }}>
                    <Toast
                        show={showSummaryToast && !showSummaryPopup}
                        onClose={() => setShowSummaryToast(false)}
                        bg='primary'
                        style={{ cursor: "pointer", minWidth: "200px" }}>
                        <Toast.Body className='text-white d-flex justify-content-between align-items-center'>
                            <div
                                onClick={() => {
                                    setShowSummaryPopup(true);
                                    setShowSummaryToast(false);
                                }}
                                style={{ flex: 1, cursor: "pointer" }}>
                                <p className='mb-0 text-semi-bold'>
                                    📝 New review summary available!
                                </p>
                                <small className='text-dark text-semi-bold'>
                                    Click to view
                                </small>
                            </div>
                            <Button onClick={() => setShowSummaryToast(false)}>
                                <i class='bi bi-x-circle'></i>
                            </Button>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>

                {/* Expanded Summary Popup */}
                {showSummaryPopup && (
                    <div
                        className='summary-popup shadow-lg rounded p-4'
                        style={{
                            position: "fixed",
                            bottom: "80px",
                            right: "20px",
                            background: "#fff",
                            zIndex: 1055,
                            width: "90%", 
                            maxWidth: "600px", 
                            maxHeight: "50vh", 
                            overflowY: "auto",
                            border: "1px solid #ffbbbb",
                        }}>
                        <div className='d-flex justify-content-between align-items-center mb-2'>
                            <h6 className='fw-semi-bold m-0'>
                                📝 What Customers Say
                            </h6>
                            <Button
                                variant='outline-danger'
                                size='sm'
                                onClick={() => setShowSummaryPopup(false)}>
                                <i className='bi bi-x-circle'></i>
                            </Button>
                        </div>
                        {loadingByAction.getReviewSummary ? (
                            <p>Generating summary...</p>
                        ) : (
                            <p>{reviewSummary}</p>
                        )}
                    </div>
                )}
            </section>
            <Footer />
        </>
    );
}

export default ProductDetailPage;
