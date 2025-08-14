import { Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import "./categories.css";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../../features/categorySlice";
import { useEffect, useState } from "react";
import { clearCategoryErrors } from "../../../features/categorySlice";

const AddCategories = () => {
    const {category, errorByAction, loadingByAction} = useSelector(state => state.category);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({name: '', description: ''});

    const handleData = (e)=>{
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    useEffect(()=>{
        dispatch(clearCategoryErrors());
    }, [dispatch])

    const handleAddCategory = async(e)=>{
        e.preventDefault();
        try{
            await dispatch(addCategory(formData)).unwrap();
            navigate('/categories');
        }catch(err){
            console.log('add category error', err);
        }
    }

    const getFieldErrors = (fieldName)=>{
        return errorByAction.addCategory?.find(e => e.field === fieldName)?.message;
    }

    return (
        <>
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container edit-categories-form-container'>
                        <h2 className='mt-5 text-center mb-5'>
                            Add categories
                        </h2>
                        {getFieldErrors('general') && <small className="text-danger mb-3">{getFieldErrors('general')}</small>}
                        <Form className='p-4 rounded edit-categories-form' noValidate onSubmit={handleAddCategory}>
                            {/* Add Category */}
                            <Form.Group
                                className='mb-4'
                                controlId='categoryName'>
                                <Form.Label className='fw-bold'>
                                    Add Category
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Category Name'
                                    className='rounded-pill edit-category-input'
                                    name="name"
                                    value={formData.name}
                                    onChange={handleData}
                                />
                                {getFieldErrors('name') && <small className="text-danger">{getFieldErrors('name')}</small>}
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className='mb-4' controlId='stocks'>
                                <Form.Label className='fw-bold'>
                                    Description
                                </Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={4}
                                    name="description"
                                    className='edit-category-input'
                                    value={formData.description}
                                    onChange={handleData}
                                />
                                {getFieldErrors('description') && <small className="text-danger">{getFieldErrors('description')}</small>}
                            </Form.Group>

                            {/* Buttons */}
                            <Row className='justify-content-center'>
                                <Col xs='auto'>
                                    <Button onClick={() => navigate('/categories')}
                                        variant='outline-dark'
                                        className='px-5 py-2 rounded mb-3'>
                                        Cancel
                                    </Button>
                                </Col>
                                <Col xs='auto'>
                                    <Button
                                        variant='dark'
                                        type="submit"
                                        className='px-5 py-2 rounded'>
                                        Add
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

export default AddCategories;
