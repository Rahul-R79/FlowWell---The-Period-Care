import { Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import "./categories.css";
import { getSingleCategory } from "../../../features/categorySlice";
import { editCategory } from "../../../features/categorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearCategoryErrors } from "../../../features/categorySlice";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const EditCategories = () => {
    const {loadingByAction, errorByAction, currentCategory} = useSelector(state => state.category);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {id} = useParams();

    const [formData, setFromData] = useState({name: '', description: ''});
    
    useEffect(()=>{
        dispatch(clearCategoryErrors());
        dispatch(getSingleCategory(id));
    }, [dispatch, id]);

    useEffect(()=>{
        if(currentCategory){
            setFromData({name: currentCategory.name, description: currentCategory.description});
        }
    }, [currentCategory]);

    const handleData = (e)=>{
        setFromData({...formData, [e.target.name] : e.target.value});
    }

    const editHandleSubmit = async(e)=>{
        e.preventDefault();
        try{
            await dispatch(editCategory({id, formData})).unwrap();
            navigate('/categories')
        }catch(err){
            console.log('edit category error', err);
        }
    }

    const getFieldError = (fieldName)=>{
        return errorByAction.editCategory?.find(e => e.field === fieldName)?.message;
    }

    return (
        <>
            {loadingByAction.editCategory && <LoadingSpinner/>}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container edit-categories-form-container'>
                        <h2 className='mt-5 text-center mb-5'>
                            Edit categories
                        </h2>
                        {getFieldError('general') && <small className="text-danger mb-4">{getFieldError('general')}</small>}
                        <Form className='p-4 rounded edit-categories-form' noValidate onSubmit={editHandleSubmit}>
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
                                    name="name"
                                    value={formData.name}
                                    onChange={handleData}
                                />
                            {getFieldError('name') && <small className="text-danger">{getFieldError('name')}</small>}
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
                                    name="description"
                                    value={formData.description}
                                    onChange={handleData}
                                />
                                {getFieldError('description') && <small className="text-danger">{getFieldError('description')}</small>}
                            </Form.Group>

                            {/* Buttons */}
                            <Row className='justify-content-center'>
                                <Col xs='auto'>
                                    <Button
                                        variant='outline-dark'
                                        className='px-5 py-2 rounded mb-3' 
                                        onClick={()=> navigate('/categories')}>
                                        Cancel
                                    </Button>
                                </Col>
                                <Col xs='auto'>
                                    <Button
                                        variant='dark'
                                        className='px-5 py-2 rounded'
                                        type="submit"
                                        disabled={loadingByAction.editCategory}
                                        >
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
