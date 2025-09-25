//user add address
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addAddress } from "../../../features/addressSlice";
import { clearAddressErrors } from "../../../features/addressSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AddAddress() {
    const disptach = useDispatch();
    const navigate = useNavigate();

    const { loadingByAction, errorByAction } = useSelector(
        (state) => state.address
    );

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        pincode: "",
        locality: "",
        streetAddress: "",
        city: "",
        state: "",
        landmark: "",
        alternatePhone: "",
        type: "home",
    });

    const handleData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await disptach(addAddress(formData)).unwrap();
            navigate("/address");
        } catch (err) {
        }
    };

    const getFieldErrors = (fieldName) => {
        return errorByAction.addAddress?.find((e) => e.field === fieldName)
            ?.message;
    };

    useEffect(() => {
        disptach(clearAddressErrors());
    }, [disptach]);

    return (
        <>
            {loadingByAction.addAddress && <LoadingSpinner />}
            <UserHeader />
            <div className='add-address container mt-5 mb-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='p-4 shadow rounded bg-white'>
                            <h3 className='text-center mb-4'>
                                ADD NEW ADDRESS
                            </h3>
                            {getFieldErrors("general") && (
                                <div className='text-center mb-3'>
                                    <small className='text-danger'>
                                        {getFieldErrors("general")}
                                    </small>
                                </div>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter name'
                                            name='fullName'
                                            value={formData.fullName}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("fullName") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("fullName")}
                                            </small>
                                        )}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>Mobile Number</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter mobile number'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("phone") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("phone")}
                                            </small>
                                        )}
                                    </div>

                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>Pincode</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter pincode'
                                            name='pincode'
                                            value={formData.pincode}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("pincode") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("pincode")}
                                            </small>
                                        )}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>Locality</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter locality'
                                            name='locality'
                                            value={formData.locality}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("locality") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("locality")}
                                            </small>
                                        )}
                                    </div>

                                    <div className='col-12 mb-3'>
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows={3}
                                            placeholder='Enter full address'
                                            name='streetAddress'
                                            value={formData.streetAddress}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("streetAddress") && (
                                            <small className='text-danger'>
                                                {getFieldErrors(
                                                    "streetAddress"
                                                )}
                                            </small>
                                        )}
                                    </div>

                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>
                                            City/District/Town
                                        </Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter city'
                                            name='city'
                                            value={formData.city}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("city") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("city")}
                                            </small>
                                        )}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter state'
                                            name='state'
                                            value={formData.state}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("state") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("state")}
                                            </small>
                                        )}
                                    </div>

                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>Landmark</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Nearby landmark'
                                            name='landmark'
                                            value={formData.landmark}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("landmark") && (
                                            <small className='text-danger'>
                                                {getFieldErrors("landmark")}
                                            </small>
                                        )}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <Form.Label>
                                            Alternate Mobile Number
                                        </Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Optional'
                                            name='alternatePhone'
                                            value={formData.alternatePhone}
                                            onChange={handleData}
                                        />
                                        {getFieldErrors("alternatePhone") && (
                                            <small className='text-danger'>
                                                {getFieldErrors(
                                                    "alternatePhone"
                                                )}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <Form.Check
                                        inline
                                        label='Home'
                                        name='type'
                                        value='home'
                                        checked={formData.type === "home"}
                                        onChange={handleData}
                                        type='radio'
                                    />
                                    <Form.Check
                                        inline
                                        label='Work'
                                        name='type'
                                        value='work'
                                        checked={formData.type === "work"}
                                        onChange={handleData}
                                        type='radio'
                                    />
                                </div>

                                <div className='d-flex justify-content-end'>
                                    <Button
                                        variant='dark'
                                        className='me-2'
                                        type='submit'>
                                        Save
                                    </Button>
                                    <Button
                                        variant='outline-dark'
                                        onClick={() => navigate("/address")}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AddAddress;
