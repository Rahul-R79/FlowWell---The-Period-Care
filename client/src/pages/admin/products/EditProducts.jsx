import { Form, Button, Row, Col } from "react-bootstrap";
import AdminFooter from "../../../components/Footer/AdminFooter";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import "./products.css";
import { useSelector, useDispatch } from "react-redux";
import {
    getProductById,
    updateProduct,
    clearAddProductError,
} from "../../../features/products/adminProductSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategory } from "../../../features/categorySlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

const EditProducts = () => {
    const { id } = useParams();
    const { currentProduct, errorByAction, loadingByAction } = useSelector(
        (state) => state.adminProducts
    );
    const { category } = useSelector((state) => state.category);

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
        offer: "",
    });

    const [imagePreviews, setImagePreviews] = useState([
        null,
        null,
        null,
        null,
    ]);

    // Prefill form when product is loaded
    useEffect(() => {
        if (id) dispatch(getProductById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProduct) {
            setFormData({
                name: currentProduct.name,
                description: currentProduct.description,
                images: currentProduct.images || [],
                basePrice: currentProduct.basePrice,
                discountPrice: currentProduct.discountPrice || "",
                category: currentProduct.category?._id || "",
                sizes: currentProduct.sizes.length
                    ? currentProduct.sizes.map((s) => ({
                          size: s.size || "",
                          stock: s.stock !== undefined ? String(s.stock) : "", 
                      }))
                    : [{ stock: "", size: "" }],
                offer: currentProduct.offer || "",
            });

            setImagePreviews([
                currentProduct.images[0] || null,
                currentProduct.images[1] || null,
                currentProduct.images[2] || null,
                currentProduct.images[3] || null,
            ]);
        }
    }, [currentProduct]);

    const handleData = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            const offerArr = formData.offer ? formData.offer.split(",") : [];
            if (checked) {
                offerArr.push(value);
            } else {
                const index = offerArr.indexOf(value);
                if (index > -1) offerArr.splice(index, 1);
            }
            setFormData({ ...formData, offer: offerArr.join(",") });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index] = {
            ...newSizes[index],
            [field]: value,
        };
        setFormData((prev) => ({ ...prev, sizes: newSizes }));
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

    const handleImageSelect = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const newImages = [...formData.images];
        newImages[index] = file;

        const newPreviews = [...imagePreviews];
        newPreviews[index] = URL.createObjectURL(file);

        setFormData({ ...formData, images: newImages });
        setImagePreviews(newPreviews);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...formData.images];
        const newPreviews = [...imagePreviews];

        newImages[index] = null;
        newPreviews[index] = null;

        setFormData({ ...formData, images: newImages });
        setImagePreviews(newPreviews);

        const fileInput = document.getElementById(`fileInput${index + 1}`);
        if (fileInput) fileInput.value = "";
    };

    const getFieldError = (fieldName) => {
        return (
            errorByAction.updateProduct?.find((e) => {
                const normalizedField = e.field.replace(/\[(\d+)\]/g, ".$1");
                return normalizedField === fieldName;
            })?.message || ""
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("basePrice", Number(formData.basePrice) || 0);
        if (formData.discountPrice)
            data.append("discountPrice", Number(formData.discountPrice));
        data.append("category", formData.category);
        data.append("sizes", JSON.stringify(formData.sizes));
        if (formData.offer && formData.offer.trim() !== "")
            data.append("offer", formData.offer);

        const existingImages = formData.images.filter(
            (img) => typeof img === "string"
        );
        data.append("existingImages", JSON.stringify(existingImages));

        formData.images.forEach((file) => {
            if (file instanceof File) data.append("images", file);
        });

        try {
            await dispatch(updateProduct({ id, formData: data })).unwrap();
            navigate("/products");
        } catch (err) {
            console.log("product update error", err);
        }
    };

    useEffect(() => {
        dispatch(clearAddProductError());
        dispatch(getCategory({ limit: 100 }));
    }, [dispatch]);

    if (loadingByAction.getProductById) return <LoadingSpinner />;

    return (
        <div className='d-flex flex-column flex-lg-row min-vh-100'>
            <Sidebar />
            <div className='flex-grow-1 d-flex flex-column main-content'>
                <div className='flex-grow-1 py-4 d-flex flex-column container product-form-container'>
                    <h4 className='mb-4 text-center text-lg-start'>
                        Edit Product
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

                        {/* Images */}
                        <Form.Group className='mb-3'>
                            <Form.Label>Product Images</Form.Label>
                            <Row>
                                {[1, 2, 3, 4].map((num) => (
                                    <Col
                                        xs={6}
                                        md={3}
                                        key={num}
                                        className='mb-3'>
                                        <div className='d-flex flex-column align-items-center justify-content-center p-3 image-upload-box position-relative'>
                                            <img
                                                src={
                                                    imagePreviews[num - 1] ||
                                                    "../images/add-img.webp"
                                                }
                                                alt='product-image'
                                                className='mb-2 upload-icon'
                                            />
                                            {imagePreviews[num - 1] && (
                                                <button
                                                    type='button'
                                                    className='btn-close position-absolute top-0 end-0 m-2'
                                                    onClick={() =>
                                                        handleRemoveImage(
                                                            num - 1
                                                        )
                                                    }
                                                />
                                            )}
                                            <input
                                                type='file'
                                                id={`fileInput${num}`}
                                                style={{ display: "none" }}
                                                onChange={(e) =>
                                                    handleImageSelect(
                                                        e,
                                                        num - 1
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor={`fileInput${num}`}
                                                className='addproduct-btn'>
                                                {imagePreviews[num - 1]
                                                    ? "Change Image"
                                                    : "Add Image"}
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

                        {/* Price, Discount, Category */}
                        <Row className='mb-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type='number'
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
                                        name='category'
                                        value={formData.category}
                                        onChange={handleData}>
                                        <option value=''>
                                            Select category
                                        </option>
                                        {category
                                            .filter(
                                                (cat) => cat.status === "active"
                                            )
                                            .map((value) => (
                                                <option
                                                    key={value._id}
                                                    value={value._id}>
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

                        {/* Sizes */}
                        {formData.sizes.map((variant, index) => (
                            <Row className='mb-2' key={index}>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Stock Limit</Form.Label>
                                        <Form.Control
                                            type='number'
                                            min={1}
                                            value={variant.stock}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    index,
                                                    "stock",
                                                    e.target.value
                                                )
                                            }
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
                                            value={variant.size}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    index,
                                                    "size",
                                                    e.target.value
                                                )
                                            }>
                                            <option value=''>
                                                Select size
                                            </option>
                                            <option value='small'>Small</option>
                                            <option value='medium'>
                                                Medium
                                            </option>
                                            <option value='large'>Large</option>
                                            <option value='xl'>XL</option>
                                            <option value='regular'>
                                                Regular
                                            </option>
                                        </Form.Select>
                                        {getFieldError(
                                            `sizes.${index}.size`
                                        ) && (
                                            <small className='text-danger'>
                                                {getFieldError(
                                                    `sizes.${index}.size`
                                                )}
                                            </small>
                                        )}
                                        {index !== 0 && (
                                            <Button
                                                variant='danger'
                                                onClick={() =>
                                                    removeSizeVarient(index)
                                                }
                                                className='mt-2'>
                                                Remove
                                            </Button>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        ))}

                        {/* Offers */}
                        <Row className='mb-4'>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Offers</Form.Label>
                                    <div>
                                        <Form.Check
                                            type='checkbox'
                                            label='Flat 50'
                                            name='offer'
                                            value='FLAT'
                                            checked={formData.offer?.includes(
                                                "FLAT"
                                            )}
                                            onChange={handleData}
                                        />
                                        <Form.Check
                                            type='checkbox'
                                            label='Buy One Get One Free'
                                            name='offer'
                                            value='BOGO'
                                            checked={formData.offer?.includes(
                                                "BOGO"
                                            )}
                                            onChange={handleData}
                                        />
                                    </div>
                                    {getFieldError("offer") && (
                                        <small className='text-danger'>
                                            {getFieldError("offer")}
                                        </small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button
                                    variant='primary'
                                    className='mb-4'
                                    type='button'
                                    onClick={addSizeVarient}>
                                    Add Variant
                                </Button>
                            </Col>
                        </Row>

                        {/* Buttons */}
                        <div className='d-flex justify-content-center gap-2'>
                            <Button
                                variant='light'
                                className='px-4'
                                onClick={() => navigate("/products")}>
                                Cancel
                            </Button>
                            <Button
                                variant='dark'
                                className='px-4'
                                type='submit'>
                                Update
                            </Button>
                        </div>
                    </Form>
                </div>
                <AdminFooter />
            </div>
        </div>
    );
};

export default EditProducts;
