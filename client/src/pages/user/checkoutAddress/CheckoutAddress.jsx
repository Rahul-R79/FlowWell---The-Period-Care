import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import "./checkoutAddress.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllAddresses, deleteAddress } from "../../../features/addressSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { confirmAlert } from "../../../utils/confirmAlert";
import ToastNotification, {
    showSuccessToast,
} from "../../../components/ToastNotification";
import { setSelectedAddress } from "../../../features/addressSlice";

const CheckoutAddress = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addresses, loadingByAction, selectedAddress } = useSelector(
        (state) => state.address
    );

    const { totals } = useSelector((state) => state.cart);

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

    const handleSelectedAddress = (id)=>{
        dispatch(setSelectedAddress(id));
    }

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

    return (
        <>
            {loadingByAction.getAllAddresses && <LoadingSpinner />}
            <UserHeader />
            <ToastNotification />
            <section className='checkout-address container'>
                <h3 className='mb-4 fw-bold'>Select Your Address</h3>
                <Row>
                    <Col lg={8} md={12}>
                        <div className='address-conatainer p-3 border rounded'>
                            <Form>
                                {addresses.map((address, index) => (
                                    <Card
                                        onClick={()=> handleSelectedAddress(address._id)}
                                        key={address._id}
                                        style={{cursor: "pointer"}}
                                        className='mb-3 p-3'>
                                        <Form.Check
                                            type='radio'
                                            name='selectedAddress'
                                            checked={selectedAddress === address._id}
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
                                <span>₹{totals.subtotal}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2 text-danger'>
                                <span>Discount</span>
                                <span>-₹{totals.discount}</span>
                            </div>
                            <div className='d-flex justify-content-between mb-2'>
                                <span>Delivery Fee</span>
                                <span>₹{totals.deliveryFee}</span>
                            </div>
                            <hr />
                            <div className='d-flex justify-content-between fw-bold mb-3'>
                                <span>Total</span>
                                <span>₹{totals.total}</span>
                            </div>
                            <Button variant='dark' className='w-100' onClick={()=> navigate('/payment', {replace: true})}>
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
