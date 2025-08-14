import { Form, Button, Table, Row, Col } from "react-bootstrap";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import PaginationButton from "../../../components/Pagination";
import { Link } from "react-router-dom";
import "./categories.css";
import { useSelector, useDispatch } from "react-redux";
import { getCategory } from "../../../features/categorySlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import { setCurrentPage } from "../../../features/categorySlice";

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const {category, loadingByAction, errorByAction, currentPage, totalPages} = useSelector(state => state.category);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(()=>{
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            dispatch(setCurrentPage(1));
        }, 500);
        return ()=> clearTimeout(handler);
    }, [dispatch, search]);


    useEffect(()=>{
        dispatch(getCategory({page: currentPage, search: debouncedSearch}));
    }, [dispatch, currentPage, debouncedSearch]);

    return (
        <>
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container categories-form-container'>
                        <h4 className='mb-4 text-center text-lg-start'>
                            Categories
                        </h4>

                        {/* categories*/}
                        <Form className='mb-4'>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                                {/* Search input */}
                                <div className='position-relative'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search here'
                                        aria-label='Search here'
                                        className='rounded-pill ps-5 search-input'
                                        value={search}
                                        onChange={(e)=> setSearch(e.target.value)}
                                    />
                                    <FaSearch className='search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
                                </div>

                                {/*add button */}
                                <Link to='/addcategories'>
                                    <Button className='add-btn' variant='dark'>
                                        Add Category
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                        {/* Categories table */}
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.filter(Boolean).map(({_id, name, description}) => (
                                    <tr key={_id}>
                                        <td>{name}</td>
                                        <td>{description}</td>
                                        <td>
                                            <Link to='/editcategories' style={{ color: "inherit", textDecoration: "none" }}>
                                                <MdOutlineModeEdit className='me-3'style={{ cursor: "pointer" }}/>
                                            </Link>
                                            <FaTrash style={{ cursor: "pointer" }}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <PaginationButton 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            dispatch(setCurrentPage(page));
                        }}
                    />
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;
