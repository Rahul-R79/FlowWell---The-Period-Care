//admin edit banner
import { Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { useSelector, useDispatch } from "react-redux";
import {
    editBanner,
    clearBannerErrors,
    getSingleBanner,
} from "../../../features/banner/adminBannerSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const EditBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { loadingByAction, errorByAction, currentBanner } = useSelector(
        (state) => state.adminBanner
    );

    const [formData, setformData] = useState({
        title: "",
        subTitle: "",
        startingDate: "",
        endingDate: "",
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleData = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("subTitle", formData.subTitle);
        data.append("startingDate", formData.startingDate);
        data.append("endingDate", formData.endingDate);
        data.append("image", formData.image);

        try {
            await dispatch(editBanner({ id, formData: data })).unwrap();
            navigate("/admin/banner");
        } catch (err) {
        }
    };

    useEffect(() => {
        if (currentBanner) {
            setformData({
                title: currentBanner.title,
                subTitle: currentBanner.subTitle,
                startingDate: currentBanner.startingDate.split("T")[0],
                endingDate: currentBanner.endingDate.split("T")[0],
                image: currentBanner.image,
            });
            setPreviewImage(currentBanner.image);
        }
    }, [currentBanner]);

    useEffect(() => {
        dispatch(clearBannerErrors());
        dispatch(getSingleBanner(id));
    }, [dispatch, id]);

    const getFieldError = (fieldName) => {
        return errorByAction.editBanner?.find((e) => e.field === fieldName)
            ?.message;
    };

    return (
        <>
            {loadingByAction.editBanner && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container add-banner-form-container'>
                        <h2 className='mt-5 text-center mb-5 fw-bold'>
                            Edit Banners
                        </h2>

                        <Row className='justify-content-center'>
                            <Col xs={12} lg={9} xl={8}>
                                <div className='p-4 rounded shadow-sm border bg-white'>
                                    <Form onSubmit={handleSubmit} noValidate>
                                        {/* Title */}
                                        <Form.Group
                                            className='mb-4'
                                            controlId='formTitle'>
                                            <Form.Label className='fw-semibold'>
                                                Title
                                            </Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='title'
                                                value={formData.title}
                                                onChange={handleData}
                                            />
                                            {getFieldError("title") && (
                                                <small className='text-danger'>
                                                    {getFieldError("title")}
                                                </small>
                                            )}
                                        </Form.Group>

                                        {/* Subtitle */}
                                        <Form.Group
                                            className='mb-4'
                                            controlId='formSubtitle'>
                                            <Form.Label className='fw-semibold'>
                                                Sub title
                                            </Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='subTitle'
                                                value={formData.subTitle}
                                                onChange={handleData}
                                            />
                                            {getFieldError("subTitle") && (
                                                <small className='text-danger'>
                                                    {getFieldError("subTitle")}
                                                </small>
                                            )}
                                        </Form.Group>

                                        {/* Start Date */}
                                        <Form.Group
                                            className='mb-4'
                                            controlId='formStartDate'>
                                            <Form.Label className='fw-semibold'>
                                                Starting date
                                            </Form.Label>
                                            <Form.Control
                                                type='date'
                                                name='startingDate'
                                                value={formData.startingDate}
                                                onChange={handleData}
                                            />
                                            {getFieldError("startingDate") && (
                                                <small className='text-danger'>
                                                    {getFieldError(
                                                        "startingDate"
                                                    )}
                                                </small>
                                            )}
                                        </Form.Group>

                                        {/* End Date */}
                                        <Form.Group
                                            className='mb-4'
                                            controlId='formEndDate'>
                                            <Form.Label className='fw-semibold'>
                                                End date
                                            </Form.Label>
                                            <Form.Control
                                                type='date'
                                                name='endingDate'
                                                value={formData.endingDate}
                                                onChange={handleData}
                                            />
                                            {getFieldError("endingDate") && (
                                                <small className='text-danger'>
                                                    {getFieldError(
                                                        "endingDate"
                                                    )}
                                                </small>
                                            )}
                                        </Form.Group>

                                        {/* Image */}
                                        <Form.Group
                                            className='mb-4'
                                            controlId='bannerFile'>
                                            <Form.Label className='fw-semibold'>
                                                Add image
                                            </Form.Label>

                                            <Form.Control
                                                type='file'
                                                accept='image/*'
                                                className='d-none'
                                                name='image'
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    setformData({
                                                        ...formData,
                                                        image: file,
                                                    });
                                                    if (file) {
                                                        setPreviewImage(
                                                            URL.createObjectURL(
                                                                file
                                                            )
                                                        );
                                                    } else {
                                                        setPreviewImage(null);
                                                    }
                                                }}
                                            />

                                            <label
                                                htmlFor='bannerFile'
                                                className='p-4 bg-success bg-opacity-25 rounded text-center w-100 d-block fw-semibold text-dark'
                                                style={{ cursor: "pointer" }}>
                                                <i className='bi bi-cloud-upload'></i>{" "}
                                                Upload
                                            </label>

                                            {/* Image Preview */}
                                            {previewImage && (
                                                <div className='mt-3 text-center position-relative'>
                                                    <img
                                                        src={previewImage}
                                                        alt='Banner Preview'
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "300px",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>

                                        <div className='text-center'>
                                            <Button
                                                variant='dark'
                                                type='submit'
                                                className='px-5 py-2 mx-3 mb-3'>
                                                Save
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    navigate("/admin/banner")
                                                }
                                                variant='outline-dark'
                                                type='button'
                                                className='px-5 py-2 mb-3'>
                                                Cancel
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default EditBanner;
