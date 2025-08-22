import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEdit, FaCamera } from "react-icons/fa";
import "./userProfile.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function UserProfile() {
    const { user } = useSelector((state) => state.auth);
    return (
        <> 
            <UserHeader />
            <div className='profile-page container mt-5 mb-5'>
                <div className='row'>
                    {/* Sidebar */}
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    {/* Main content */}
                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='profile-content p-4 rounded shadow-sm'>
                            <h4 className='text-center mb-4 text-white fw-bold'>
                                PROFILE
                            </h4>

                            {/* Profile Image */}
                            <div className='text-center mb-4 position-relative'>
                                <img
                                    src={
                                        user?.avatar ||
                                        "/images/hero/default-avatar.webp"
                                    }
                                    alt='User Avatar'
                                    className='rounded-circle userProfileAvatar'
                                />
                                <Button
                                    variant='dark'
                                    size='sm'
                                    className='position-absolute'
                                    style={{
                                        bottom: "10px",
                                        right: "calc(50% - 50px)",
                                        borderRadius: "50%",
                                    }}>
                                    <FaCamera />
                                </Button>
                            </div>

                            {/* Profile Form */}
                            <Form>
                                {/* Name */}
                                <Form.Group className='mb-3'>
                                    <Form.Label className='text-white'>
                                        Name:
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='text'
                                            defaultValue={user.name}
                                        />
                                        <InputGroup.Text>
                                            <FaEdit />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                {/* Email */}
                                <Form.Group className='mb-3'>
                                    <Form.Label className='text-white'>
                                        Email:
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='email'
                                            defaultValue={user.email}
                                        />
                                        <InputGroup.Text>
                                            <FaEdit />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                {/* Phone */}
                                <Form.Group className='mb-3'>
                                    <Form.Label className='text-white'>
                                        Phone:
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='text'
                                            placeholder='Mobile'
                                        />
                                        <InputGroup.Text>
                                            <FaEdit />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                {/* Change Password */}
                                {!user?.googleId && (
                                    <div className='mb-3'>
                                        <Link
                                            to={"/changepassword"}
                                            className='text-info text-decoration-none'>
                                            Change password
                                        </Link>
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className='text-center'>
                                    <Button variant='primary' type='submit'>
                                        Save changes
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

export default UserProfile;
