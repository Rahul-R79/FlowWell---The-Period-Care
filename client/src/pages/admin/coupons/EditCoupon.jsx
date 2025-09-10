import { Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { useSelector, useDispatch } from "react-redux";
import {
    getSingleCoupon,
    clearCouponErrors,
    editCoupon,
} from "../../../features/coupons/adminCouponSlice";
import { useEffect, useState } from "react";
import "./adminCoupon.css";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";

const EditCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();

    const { loadingByAction, errorByAction, currentCoupon } = useSelector(
        (state) => state.adminCoupon
    );
    const [formData, setFormData] = useState({});

    const handleData = (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const getFieldError = (fieldName) => {
        return errorByAction.editCoupon?.find(
            (e) => e.field === fieldName
        )?.message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(editCoupon({id, formData})).unwrap();
            navigate('/admin/coupons');
        } catch (err) {
            console.log("edit coupon error:", err);
        }
    };

    useEffect(()=>{
        if(currentCoupon){
            setFormData({
                couponName: currentCoupon.couponName,
                couponCode: currentCoupon.couponCode,
                couponType: currentCoupon.couponType,
                discountValue: currentCoupon.discountValue,
                expirationDate: currentCoupon.expirationDate.split('T')[0],
                minPurchaseAmount: currentCoupon.minPurchaseAmount,
                maxDiscountAmount: currentCoupon.maxDiscountAmount,
                usageLimit: currentCoupon.usageLimit,
                firstOrderOnly: currentCoupon.firstOrderOnly
            })
        }
    }, [currentCoupon])

    useEffect(() => {
        dispatch(clearCouponErrors());
        dispatch(getSingleCoupon(id))
    }, [dispatch, id]);

    return (
        <>
            {loadingByAction.editCoupon && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container add-coupon-form-container'>
                        <h2 className='mt-5 text-center mb-5'>
                            Edit Coupon
                        </h2>

                        <Form
                            className='p-4 rounded add-coupon-form'
                            noValidate
                            onSubmit={handleSubmit}>
                            <Row className='mb-3'>
                                {getFieldError('general') && <small className="text-center mb-4 text-danger">{getFieldError('general')}</small>}
                                <Col md={4}>
                                    <Form.Group controlId='couponName'>
                                        <Form.Label>Coupon Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            name='couponName'
                                            value={formData.couponName || ""}
                                            onChange={handleData}
                                            placeholder='Enter coupon name'
                                            required
                                        />
                                    </Form.Group>
                                    {getFieldError("couponName") && (
                                        <small className='text-danger'>
                                            {getFieldError("couponName")}
                                        </small>
                                    )}
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId='couponCode'>
                                        <Form.Label>Coupon Code</Form.Label>
                                        <Form.Control
                                            type='text'
                                            name='couponCode'
                                            value={formData.couponCode || ""}
                                            onChange={handleData}
                                            placeholder='Enter coupon code'
                                            required
                                        />
                                    </Form.Group>
                                    {getFieldError("couponCode") && (
                                        <small className='text-danger'>
                                            {getFieldError("couponCode")}
                                        </small>
                                    )}
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId='couponType'>
                                        <Form.Label>Coupon Type</Form.Label>
                                        <Form.Select
                                            name='couponType'
                                            value={formData.couponType || ""}
                                            onChange={handleData}
                                            required>
                                            <option value=''>
                                                Select type
                                            </option>
                                            <option value='percentage'>
                                                Percentage
                                            </option>
                                            <option value='fixed'>Fixed</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {getFieldError("couponType") && (
                                        <small className='text-danger'>
                                            {getFieldError("couponType")}
                                        </small>
                                    )}
                                </Col>
                            </Row>

                            <Row className='mb-3'>
                                <Col md={4}>
                                    <Form.Group controlId='discountValue'>
                                        <Form.Label>Discount Value</Form.Label>
                                        <Form.Control
                                            type='number'
                                            name='discountValue'
                                            value={formData.discountValue || ""}
                                            onChange={handleData}
                                            placeholder='Enter discount value'
                                            required
                                        />
                                    </Form.Group>
                                    {getFieldError("discountValue") && (
                                        <small className='text-danger'>
                                            {getFieldError("discountValue")}
                                        </small>
                                    )}
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId='minPurchaseAmount'>
                                        <Form.Label>
                                            Minimum Purchase Amount (₹)
                                        </Form.Label>
                                        <Form.Control
                                            type='number'
                                            name='minPurchaseAmount'
                                            value={
                                                formData.minPurchaseAmount || ""
                                            }
                                            onChange={handleData}
                                            placeholder='Min
                                            
                                            amount (optional)'
                                        />
                                    </Form.Group>
                                    {getFieldError("minPurchaseAmount") && (
                                        <small className='text-danger'>
                                            {getFieldError("minPurchaseAmount")}
                                        </small>
                                    )}
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId='maxDiscountAmount'>
                                        <Form.Label>
                                            Maximum Discount Amount (₹)
                                        </Form.Label>
                                        <Form.Control
                                            type='number'
                                            name='maxDiscountAmount'
                                            value={
                                                formData.maxDiscountAmount || ""
                                            }
                                            onChange={handleData}
                                            placeholder='Max discount (optional)'
                                        />
                                    </Form.Group>
                                    {getFieldError("maxDiscountAmount") && (
                                        <small className='text-danger'>
                                            {getFieldError("maxDiscountAmount")}
                                        </small>
                                    )}
                                </Col>
                            </Row>

                            <Row className='mb-3'>
                                <Col md={4}>
                                    <Form.Group controlId='usageLimit'>
                                        <Form.Label>Usage Limit</Form.Label>
                                        <Form.Control
                                            type='number'
                                            name='usageLimit'
                                            value={formData.usageLimit || ""}
                                            onChange={handleData}
                                            placeholder='Total allowed usages'
                                        />
                                    </Form.Group>
                                    {getFieldError("usageLimit") && (
                                        <small className='text-danger'>
                                            {getFieldError("usageLimit")}
                                        </small>
                                    )}
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId='expirationDate'>
                                        <Form.Label>Expiration Date</Form.Label>
                                        <Form.Control
                                            type='date'
                                            name='expirationDate'
                                            value={
                                                formData.expirationDate || ""
                                            }
                                            onChange={handleData}
                                            required
                                        />
                                    </Form.Group>
                                    {getFieldError("expirationDate") && (
                                        <small className='text-danger'>
                                            {getFieldError("expirationDate")}
                                        </small>
                                    )}
                                </Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col md={4}>
                                    <Form.Group
                                        controlId='firstOrderOnly'
                                        className='d-flex align-items-center'>
                                        <Form.Check.Input
                                            type='checkbox'
                                            name='firstOrderOnly'
                                            checked={
                                                formData.firstOrderOnly || false
                                            }
                                            onChange={handleData}
                                        />
                                        <Form.Check.Label className='ms-2'>
                                            Valid only for first order
                                        </Form.Check.Label>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button
                                variant='primary'
                                type='submit'
                                className='me-2'>
                                Update
                            </Button>
                            <Button variant='secondary' type='button' onClick={()=> navigate('/admin/coupons')}>
                                Cancel
                            </Button>
                        </Form>
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default EditCoupon;
