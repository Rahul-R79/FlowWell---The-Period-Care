import { Form, Button, Row, Col } from "react-bootstrap";
import AdminFooter from "../../../components/Footer/AdminFooter";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import "./products.css";

const AddProducts = () => {
    return (
        <>
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container product-form-container'>
                        <h4 className='mb-4 text-center text-lg-start'>
                            Add Product
                        </h4>

                        <Form className='p-4 border rounded bg-white shadow-sm'>
                            {/* Product Name */}
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter product name'
                                    className='border'
                                />
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className='mb-3'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    placeholder='Write your description here...'
                                    className='border'
                                />
                            </Form.Group>

                            {/* Image Uploads */}
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Images</Form.Label>
                                <Row>
                                    {[1, 2, 3, 4].map((num) => (
                                        <Col
                                            xs={6}
                                            md={3}
                                            key={num}
                                            className='mb-3'>
                                            <div className='d-flex flex-column align-items-center justify-content-center p-3 image-upload-box'>
                                                <img
                                                    src='../images/add-img.webp'
                                                    alt='Add'
                                                    className='mb-2 upload-icon'
                                                />
                                                {/* Hidden file input */}
                                                <input
                                                    type='file'
                                                    id='fileInput'
                                                    style={{ display: "none" }}
                                                />
                                                <label
                                                    htmlFor='fileInput'
                                                    className='addproduct-btn'>
                                                    Add Image
                                                </label>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Form.Group>

                            {/* Price / Discount / category */}
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='₹ 1399'
                                            className='border'
                                            min={10}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Discount Price</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter discount price'
                                            className='border'
                                            min={10}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select className='border'>
                                            <option>Select category</option>
                                            <option>Category 1</option>
                                            <option>Category 2</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* stock & Size */}
                            <Row className='mb-4'>
                                <Col>
                                <Form.Group>
                                        <Form.Label>Stock Limit</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter stock limit'
                                            className='border'
                                            min={1}
                                        />
                                    </Form.Group>
                                    
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Size</Form.Label>
                                        <Form.Select className='border'>
                                            <option>Select size</option>
                                            <option>Small</option>
                                            <option>Medium</option>
                                            <option>Large</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col className='d-flex align-items-end'>
                                    <button className="btn btn-primary w-100">Add Variant</button>
                                </Col>
                            </Row>

                            {/* Buttons */}
                            <div className='d-flex justify-content-center gap-2'>
                                <Button variant='light' className='px-4'>
                                    Cancel
                                </Button>
                                <Button variant='dark' className='px-4'>
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default AddProducts;
