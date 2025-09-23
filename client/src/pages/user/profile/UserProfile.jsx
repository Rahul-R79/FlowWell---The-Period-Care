// user profile page
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEdit, FaCamera } from "react-icons/fa";
import "./userProfile.css";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../../../features/profileSlice";
import { setCurrentUser } from "../../../features/auth/authUserSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ImageCropper from "../../../components/ImageCropper";
import { resetProfileState } from "../../../features/profileSlice";
import { confirmAlert } from "../../../utils/confirmAlert";

function UserProfile() {
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const { user: authUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        user: profileUser,
        loadingByAction,
        errorByAction,
    } = useSelector((state) => state.profile);

    const [formData, setFormData] = useState({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phone: authUser?.phone || "",
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(
        authUser?.avatar || "/images/hero/default-avatar.webp"
    );

    useEffect(() => {
        if (profileUser) {
            setFormData({
                name: profileUser.name,
                email: profileUser.email,
                phone: profileUser.phone,
                avatar: null,
            });
            setAvatarPreview(
                profileUser.avatar || "/images/hero/default-avatar.webp"
            );
        }
        dispatch(resetProfileState());
    }, [profileUser, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setCropImageSrc(reader.result);
                setShowCropper(true);
            };
        }
    };

    const handleCropComplete = (croppedFile) => {
        setFormData({ ...formData, avatar: croppedFile });
        setAvatarPreview(URL.createObjectURL(croppedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        if (formData.phone) data.append("phone", formData.phone);
        if (formData.avatar) data.append("image", formData.avatar);

        try {
            const currentUser = await dispatch(updateProfile(data)).unwrap();
            dispatch(setCurrentUser(currentUser));
        } catch (err) {
            alert('profile update error');
        }
    };

    const isChanged =
        formData.name !== authUser?.name ||
        formData.phone !== authUser?.phone ||
        formData.avatar !== null ||
        avatarPreview !==
            (authUser?.avatar || "/images/hero/default-avatar.webp");

    const getFieldError = (fieldName) => {
        return errorByAction.updateProfile?.find((e) => e.field === fieldName)
            ?.message;
    };

    const handleChangePassword = async () => {
        const confirmed = await confirmAlert(
            "Change Password?",
            "Are you sure you want to change the password",
            "Confirm",
            "Cancel"
        );

        if (confirmed) {
            navigate("/changepassword");
        }
    };

    return (
        <>
            {loadingByAction.updateProfile && <LoadingSpinner />}
            <UserHeader />
            <div className='profile-page container mt-5 mb-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='profile-content p-4 rounded shadow-sm'>
                            <h4 className='text-center mb-4 text-white fw-bold'>
                                PROFILE
                            </h4>

                            {/* Avatar */}
                            <div className='text-center mb-4 position-relative'>
                                <input
                                    type='file'
                                    id='avatarInput'
                                    accept='image/*'
                                    onChange={handleAvatarChange}
                                    style={{ display: "none" }}
                                />
                                <label
                                    className='avatar-preview'
                                    htmlFor='avatarInput'>
                                    <img
                                        src={avatarPreview}
                                        alt='User Avatar'
                                        className='rounded-circle userProfileAvatar'
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/images/hero/default-avatar.webp";
                                        }}
                                    />
                                    <span className='avatar-camera-icon'>
                                        <FaCamera />
                                    </span>
                                </label>
                            </div>

                            {/* Form */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='text-white'>
                                        Name:
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='text'
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        <InputGroup.Text>
                                            <FaEdit />
                                        </InputGroup.Text>
                                    </InputGroup>
                                    {getFieldError("name") && (
                                        <small className='text-danger'>
                                            {getFieldError("name")}
                                        </small>
                                    )}
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <Form.Label className='text-white'>
                                        Email:
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            readOnly
                                        />
                                        <InputGroup.Text>
                                            <FaEdit />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <Form.Label className='text-white'>
                                        Phone:
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='number'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='Mobile'
                                        />
                                        <InputGroup.Text>
                                            <FaEdit />
                                        </InputGroup.Text>
                                    </InputGroup>
                                    {getFieldError("phone") && (
                                        <small className='text-danger'>
                                            {getFieldError("phone")}
                                        </small>
                                    )}
                                </Form.Group>

                                {!authUser?.googleId && (
                                    <div className='mb-3'>
                                        <Button
                                            variant='link'
                                            onClick={handleChangePassword}
                                            className='text-info text-decoration-none'>
                                            Change password
                                        </Button>
                                    </div>
                                )}

                                <div className='text-center'>
                                    <Button
                                        variant='primary'
                                        type='submit'
                                        disabled={!isChanged}>
                                        Save changes
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && (
                <ImageCropper
                    imageSrc={cropImageSrc}
                    onCropComplete={handleCropComplete}
                    onClose={() => setShowCropper(false)}
                />
            )}

            <Footer />
        </>
    );
}

export default UserProfile;
