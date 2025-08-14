import { Form, Button, Table, Row, Col } from "react-bootstrap";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import PaginationButton from "../../../components/Pagination";
import { Link } from "react-router-dom";
import "./categories.css";

const CategoriesPage = () => {
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
                                    <th>#</th>
                                    <th>Category Name</th>
                                    <th>stocks</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>Sample Category {index + 1}</td>
                                        <td>{index + 1}</td>
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

                    <PaginationButton />

                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;
