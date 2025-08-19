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
} from "react-bootstrap";
import UserHeader from "../../../components/Header/UserHeader";
import Footer from "../../../components/Footer/UserFooter";
import "./userProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { getUserProductById } from "../../../features/products/userProductSlice";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";

function ProductDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { productDetail, loadingByAction, similarProducts } = useSelector(
        (state) => state.userProducts
    );

    useEffect(() => {
        dispatch(getUserProductById(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    const [quantity, setQuantity] = useState(1);

    const handleQuantity = (type) => {
        if (type === "inc") setQuantity((prev) => prev + 1);
        if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    return (
        <>
            {loadingByAction.getUserProductById && <LoadingSpinner />}
            <UserHeader />
            <section className='product-detail'>
                <Container className=' py-5'>
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
                                        />
                                    ))}
                            </div>
                            {/* Main Image */}
                            <div className='flex-grow-1 product-main'>
                                {productDetail?.images?.[0] && (
                                    <ReactImageMagnify
                                        {...{
                                            smallImage: {
                                                alt: productDetail.name,
                                                isFluidWidth: true,
                                                src: productDetail.images[0],
                                            },
                                            largeImage: {
                                                src: productDetail.images[0],
                                                width: 1000,
                                                height: 1000,
                                            },
                                            lensStyle: {
                                                backgroundColor:
                                                    "rgba(0,0,0,.2)",
                                                border: "1px solid #000",
                                            },
                                            enlargedImageContainerStyle: {
                                                zIndex: 9999,
                                            },
                                            enlargedImagePosition: "over",
                                            isHintEnabled: true,
                                            shouldUsePositiveSpaceLens: true,
                                        }}
                                    />
                                )}
                            </div>
                        </Col>

                        {/* Right side - Product Info */}
                        <Col md={6}>
                            <h3 className='fw-bold'>{productDetail?.name}</h3>

                            {/* Reviews */}
                            <div className='d-flex align-items-center mb-2'>
                                <span className='text-warning me-2'>★★★★☆</span>
                                <span className='text-muted'>8 reviews</span>
                            </div>

                            {/* Price */}
                            <h4 className='text-success fw-bold'>
                                ₹
                                {productDetail?.basePrice -
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
                                        variant='outline-dark'
                                        size='lg'
                                        className='me-2'>
                                        {s.size.length <= 3
                                            ? s.size.toUpperCase()
                                            : s.size.charAt(0).toUpperCase()}
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

                                        <Button variant='dark' className='me-2'>
                                            Add to cart
                                        </Button>
                                        <Button variant='outline-secondary'>
                                            ♥ Add to wishlist
                                        </Button>
                                    </>
                                ) : (
                                    <h5 className='text-danger fw-bold'>
                                        Out of Stock
                                    </h5>
                                )}
                            </div>

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

                                        {/*Accordion Section */}
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
                                        <p>No reviews yet.</p>
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
            </section>
            <Footer />
        </>
    );
}

export default ProductDetailPage;
