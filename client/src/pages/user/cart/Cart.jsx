import { useEffect } from "react";
import { Row, Col, Button, Image, Form } from "react-bootstrap";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import "./cart.css";
import { useSelector, useDispatch } from "react-redux";
import {
    addToCart,
    getCart,
    removeFromCart,
} from "../../../features/cartSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ToastNotification, {
    showErrorToast,
} from "../../../components/ToastNotification";
import { confirmAlert } from "../../../utils/confirmAlert";

const Cart = () => {
    const dispatch = useDispatch();
    const { cart, loadingByAction } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    const handleQtyChange = (productId, selectedSize, delta) => {
        const item = cart.products.find(
            (p) =>
                p.product._id === productId && p.selectedSize === selectedSize
        );

        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;
        if (newQuantity > 5) {
            showErrorToast("Maximum 5 quantity allowed per product!");
            return;
        }

        dispatch(addToCart({ productId, selectedSize, quantity: delta }));
    };

    const subtotal = cart.products?.reduce(
        (acc, item) =>
            acc + (Number(item.product.basePrice) || 0) * (item.quantity || 0),
        0
    );

    const discount = cart.products?.reduce((acc, item) => {
        const { product, quantity } = item;

        let itemDiscount = 0;

        if (product.offer === "FLAT") {
            itemDiscount = (product.basePrice / 2) * quantity;
        } else {
            itemDiscount = (product.discountPrice || 0) * quantity;
        }

        return acc + itemDiscount;
    }, 0);

    const deliveryFee = subtotal > 0 && subtotal < 500 ? 99 : 0;

    const total = subtotal + deliveryFee - discount;

    const handleRemoveFromCart = async (productId, selectedSize) => {
        try {
            await dispatch(
                removeFromCart({ productId, selectedSize })
            ).unwrap();
        } catch (err) {
            showErrorToast("Remove from Cart error");
        }
    };

    const handleRemoveClick = async (id, size) => {
        const confirmed = await confirmAlert(
            "Delete from Cart?",
            "Are you sure you want to delete it from the Cart",
            "Delete",
            "Cancel"
        );

        if (confirmed) {
            handleRemoveFromCart(id, size);
        }
    };

    return (
        <>
            {loadingByAction.getCart && <LoadingSpinner />}
            <UserHeader />
            <ToastNotification />
            <section className='cart container'>
                <h3 className='mb-4 fw-bold'>Your Cart</h3>
                <Row>
                    {/* Left side: Cart Products */}
                    <Col lg={8} md={12}>
                        <div className='cart-items p-3 border rounded'>
                            {cart.products?.length > 0 ? (
                                cart.products?.map((item) => (
                                    <div
                                        key={`${item.product._id}-${item.selectedSize}`}
                                        className='d-flex align-items-center mb-3'>
                                        <Image
                                            src={item.product.images?.[0]}
                                            alt={item.product.name}
                                            rounded
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div className='ms-3 flex-grow-1'>
                                            <h6>{item.product.name}</h6>
                                            <p className='mb-1'>
                                                {item.selectedSize
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.selectedSize.slice(1)}
                                            </p>
                                            <p className='mb-0'>
                                                ₹
                                                {item.product?.offer === "FLAT"
                                                    ? item.product.basePrice / 2
                                                    : item.product?.basePrice -
                                                      (item.product
                                                          ?.discountPrice || 0)}
                                            </p>
                                        </div>
                                        <div className='d-flex align-items-center'>
                                            <Button
                                                variant='light'
                                                size='sm'
                                                onClick={() =>
                                                    handleQtyChange(
                                                        item.product._id,
                                                        item.selectedSize,
                                                        -1
                                                    )
                                                }>
                                                -
                                            </Button>
                                            <span className='mx-2'>
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant='light'
                                                size='sm'
                                                onClick={() =>
                                                    handleQtyChange(
                                                        item.product._id,
                                                        item.selectedSize,
                                                        1
                                                    )
                                                }>
                                                +
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                handleRemoveClick(
                                                    item.product._id,
                                                    item.selectedSize
                                                )
                                            }
                                            variant='light'
                                            className='ms-3 text-danger'>
                                            <i className='bi bi-trash'></i>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p>No items in Cart.</p>
                            )}
                        </div>
                    </Col>

                    {/* Right side: Order Summary */}
                    <Col lg={4} md={12} className='mt-4 mt-lg-0'>
                        <div className='order-summary p-3 border rounded sticky-summary'>
                            <h5 className='mb-3 fw-bold'>Order Summary</h5>
                            <div className='d-flex justify-content-between mb-2'>
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2 text-danger'>
                                <span>Discount</span>
                                <span>-₹{discount}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2'>
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            <hr />
                            <div className='d-flex justify-content-between fw-bold mb-3'>
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <Button variant='dark' className='w-100'>
                                Go to Checkout
                            </Button>
                        </div>
                    </Col>
                </Row>
            </section>
            <Footer />
        </>
    );
};

export default Cart;
