import { Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import "./categories.css";

const EditCategories = () => {
    return (
        <>
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container edit-categories-form-container'>
                        <h2 className='mt-5 text-center mb-5'>
                            Edit categories
                        </h2>
                        <Form className='p-4 rounded edit-categories-form'>
                            {/* edit Category */}
                            <Form.Group
                                className='mb-4'
                                controlId='categoryName'>
                                <Form.Label className='fw-bold'>
                                    Edit Category
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Category Name'
                                    className='rounded-pill edit-category-input'
                                />
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className='mb-4' controlId='stocks'>
                                <Form.Label className='fw-bold'>
                                    Description
                                </Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={4}
                                    className='edit-category-input'
                                />
                            </Form.Group>

                            {/* Buttons */}
                            <Row className='justify-content-center'>
                                <Col xs='auto'>
                                    <Button
                                        variant='outline-dark'
                                        className='px-5 py-2 rounded mb-3'>
                                        Cancel
                                    </Button>
                                </Col>
                                <Col xs='auto'>
                                    <Button
                                        variant='dark'
                                        className='px-5 py-2 rounded'>
                                        Save
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default EditCategories;
