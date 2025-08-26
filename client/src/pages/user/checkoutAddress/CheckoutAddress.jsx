import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import "./checkoutAddress.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllAddresses, deleteAddress } from "../../../features/addressSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { confirmAlert } from "../../../utils/confirmAlert";
import ToastNotification, {
    showSuccessToast,
} from "../../../components/ToastNotification";

const CheckoutAddress = () => {
    const dispatch = useDispatch();
    const { addresses, loadingByAction } = useSelector(
        (state) => state.address
    );

    const { cart } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(getAllAddresses());
    }, [dispatch]);

    const handleDeleteAddress = async (id) => {
        try {
            await dispatch(deleteAddress(id)).unwrap();
            showSuccessToast("Address deleted successfully!");
        } catch (err) {
            console.log("address delete error");
        }
    };

    const handleDeleteClick = async (id) => {
        const confirmed = await confirmAlert(
            "Delete Address?",
            "Are you sure you want to delete the address",
            "Delete",
            "Cancel"
        );

        if (confirmed) {
            handleDeleteAddress(id);
        }
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

    return (
        <>
            {loadingByAction.getAllAddresses && <LoadingSpinner />}
            <UserHeader />
            <ToastNotification />
            <section className='checkout-address container'>
                <h3 className='mb-4 fw-bold'>Select your Address</h3>
                <Row>
                    <Col lg={8} md={12}>
                        <div className='address-conatainer p-3 border rounded'>
                            <Form>
                                {addresses.map((address, index) => (
                                    <Card
                                        key={address._id}
                                        className='mb-3 p-3'>
                                        <Form.Check
                                            type='radio'
                                            name='selectedAddress'
                                            defaultChecked={index === 0}
                                            id={`address-${address._id}`}
                                            label={
                                                <div className='address-label'>
                                                    <strong>
                                                        Address {index + 1}:
                                                    </strong>
                                                    <br />
                                                    {address.fullName}
                                                    <br />
                                                    {address.city}
                                                    <br />
                                                    PIN: {address.pincode}
                                                    <br />
                                                    {address.state}
                                                </div>
                                            }
                                            className='mb-2'
                                        />
                                        <div className='d-flex justify-content-end'>
                                            <Button
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        address._id
                                                    )
                                                }
                                                variant='link'
                                                className='text-danger p-0 me-3'>
                                                <i className='bi bi-trash'></i>
                                            </Button>
                                            <Link
                                                className='p-0 text-decoration-none'
                                                to={`/checkout/address/${address._id}/edit`}>
                                                Edit
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                                <Link
                                    className='btn btn-light w-100 mt-2'
                                    to='/checkout/add/address'>
                                    Add new Address →
                                </Link>
                            </Form>
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

export default CheckoutAddress;
