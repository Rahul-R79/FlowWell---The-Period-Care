import { Form, Button, Row, Col } from "react-bootstrap";
import AdminFooter from "../../../components/Footer/AdminFooter";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import "./products.css";
import { useSelector, useDispatch } from "react-redux";
import {
    addProduct,
    clearAddProductError,
} from "../../../features/productSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategory } from "../../../features/categorySlice";

const AddProducts = () => {
    const { errorByAction, loadingByAction } = useSelector(state => state.products);
    const {category} = useSelector(state => state.category);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        images: [],
        basePrice: "",
        discountPrice: "",
        category: "",
        sizes: [{ stock: "", size: "" }], 
    });

    const handleData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(addProduct(formData)).unwrap();
            navigate("/products");
        } catch (err) {
            console.log("product add error", err);
        }
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index][field] = value;
        setFormData({ ...formData, sizes: newSizes });
    };

    const addSizeVarient = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { stock: "", size: "" }],
        });
    };

    const removeSizeVarient = (index) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes });
    };

    const getFieldError = (fieldName) => {
        return (
            errorByAction.addProduct?.find((e) => {
                const normalizedField = e.field.replace(/\[(\d+)\]/g, ".$1");
                return normalizedField === fieldName;
            })?.message || ""
        );
    };

    const handleImageChange = (e, index)=>{
        const file = e.target.files[0];
        if(!file) return 

        const newImages = [...formData.images];
        newImages[index] = file;
        setFormData({...formData, images: newImages});
    }

    useEffect(() => {
        dispatch(clearAddProductError());
        dispatch(getCategory({limit: 100}));
    }, [dispatch]);

    return (
        <div className='d-flex flex-column flex-lg-row min-vh-100'>
            <Sidebar />
            <div className='flex-grow-1 d-flex flex-column main-content'>
                <div className='flex-grow-1 py-4 d-flex flex-column container product-form-container'>
                    <h4 className='mb-4 text-center text-lg-start'>
                        Add Product
                    </h4>

                    <Form
                        className='p-4 border rounded bg-white shadow-sm'
                        noValidate
                        onSubmit={handleSubmit}>
                        {/* Product Name */}
                        <Form.Group className='mb-3'>
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter product name'
                                className='border'
                                name='name'
                                value={formData.name}
                                onChange={handleData}
                            />
                            {getFieldError("name") && (
                                <small className='text-danger'>
                                    {getFieldError("name")}
                                </small>
                            )}
                        </Form.Group>

                        {/* Description */}
                        <Form.Group className='mb-3'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                placeholder='Write your description here...'
                                className='border'
                                name='description'
                                value={formData.description}
                                onChange={handleData}
                            />
                            {getFieldError("description") && (
                                <small className='text-danger'>
                                    {getFieldError("description")}
                                </small>
                            )}
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
                                            <input
                                                type='file'
                                                id={`fileInput${num}`}
                                                style={{ display: "none" }}
                                                onChange={(e)=> handleImageChange(e, num-1)}
                                            />
                                            <label
                                                htmlFor={`fileInput${num}`}
                                                className='addproduct-btn'>
                                                Add Image
                                            </label>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            {getFieldError("images") && (
                                <small className='text-danger'>
                                    {getFieldError("images")}
                                </small>
                            )}
                        </Form.Group>

                        {/* Price / Discount / Category */}
                        <Row className='mb-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='₹ 1399'
                                        className='border'
                                        min={10}
                                        name='basePrice'
                                        value={formData.basePrice}
                                        onChange={handleData}
                                    />
                                    {getFieldError("basePrice") && (
                                        <small className='text-danger'>
                                            {getFieldError("basePrice")}
                                        </small>
                                    )}
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
                                        name='discountPrice'
                                        value={formData.discountPrice}
                                        onChange={handleData}
                                    />
                                    {getFieldError("discountPrice") && (
                                        <small className='text-danger'>
                                            {getFieldError("discountPrice")}
                                        </small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        className='border'
                                        name='category'
                                        value={formData.category}
                                        onChange={handleData}>
                                        <option value="">Select category</option>
                                        {category
                                        .filter(cat => cat.status === 'active')
                                        .map((value)=> (
                                            <option key={value._id} value={value._id}>
                                                {value.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {getFieldError("category") && (
                                        <small className='text-danger'>
                                            {getFieldError("category")}
                                        </small>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Stock & Size */}
                        {formData.sizes.map((variant, index) => (
                            <Row className='mb-4' key={index}>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Stock Limit</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter stock limit'
                                            className='border'
                                            value={variant.stock}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    index,
                                                    "stock",
                                                    e.target.value
                                                )
                                            }
                                            min={1}
                                        />
                                        {getFieldError(
                                            `sizes.${index}.stock`
                                        ) && (
                                            <small className='text-danger'>
                                                {getFieldError(
                                                    `sizes.${index}.stock`
                                                )}
                                            </small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Size</Form.Label>
                                        <Form.Select
                                            className='border'
                                            value={variant.size}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    index,
                                                    "size",
                                                    e.target.value
                                                )
                                            }>
                                            <option>Regular</option>
                                            <option>Small</option>
                                            <option>Medium</option>
                                            <option>Large</option>
                                        </Form.Select>
                                        {getFieldError("sizes") && (
                                            <small className='text-danger'>
                                                {getFieldError("sizes")}
                                            </small>
                                        )}
                                    </Form.Group>
                                    <div className="mt-2">
                                        {index !== 0 && (
                                            <Button
                                                variant='danger'
                                                onClick={() =>
                                                    removeSizeVarient(index)
                                                }>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </Col>

                            </Row>
                        ))}

                        <Button
                            variant='primary'
                            className='mb-4'
                            type="button"
                            onClick={addSizeVarient}>
                            Add Variant
                        </Button>

                        {/* Buttons */}
                        <div className='d-flex justify-content-center gap-2'>
                            <Button variant='light' className='px-4'>
                                Cancel
                            </Button>
                            <Button
                                variant='dark'
                                className='px-4'
                                type='submit'>
                                Save
                            </Button>
                        </div>
                    </Form>
                </div>
                <AdminFooter />
            </div>
        </div>
    );
};

export default AddProducts;
