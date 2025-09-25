//admin categories 
import { Form, Button, Table, Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { MdUpdateDisabled } from "react-icons/md";
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
import { changeStatus } from "../../../features/categorySlice";
import { confirmAlert } from "../../../utils/confirmAlert";

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const { category, loadingByAction, currentPage, totalPages } = useSelector(
        (state) => state.category
    );

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            dispatch(setCurrentPage(1));
        }, 500);
        return () => clearTimeout(handler);
    }, [dispatch, search]);

    useEffect(() => {
        dispatch(getCategory({ page: currentPage, search: debouncedSearch }));
    }, [dispatch, currentPage, debouncedSearch]);

    const handlechangeStatus = async (id) => {
        try {
            await dispatch(changeStatus(id)).unwrap();
        } catch (err) {
        }
    };

    const handleStatusClick = async (id, currentStatus) => {
        const confirmed = await confirmAlert(
            "Change Status?",
            `Are you sure you want to ${
                currentStatus === "active" ? "deactivate" : "activate"
            } this category?`,
            "Submit",
            "Cancel"
        );

        if (confirmed) {
            handlechangeStatus(id);
        }
    };

    return (
        <>
            {loadingByAction.getCategory && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container'>
                        <h2 className='mb-4 text-center text-lg-start'>
                            Categories
                        </h2>

                        {/* categories*/}
                        <Form className='mb-4 mt-5'>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                                {/* Search input */}
                                <div className='position-relative'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search here'
                                        aria-label='Search here'
                                        className='rounded-pill ps-5 search-input'
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <FaSearch className='search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
                                </div>

                                {/*add button */}
                                <Link to='/admin/addcategories'>
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
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map(
                                    ({ _id, name, description, status }) => (
                                        <tr key={_id}>
                                            <td>{name}</td>
                                            <td>{description}</td>
                                            <td>
                                                <Button
                                                    size='sm'
                                                    variant={
                                                        status === "active"
                                                            ? "outline-success"
                                                            : "outline-danger"
                                                    }
                                                    style={{ width: 80 }}
                                                    disabled>
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </Button>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/admin/editcategories/${_id}`}
                                                    style={{
                                                        color: "inherit",
                                                        textDecoration: "none",
                                                    }}>
                                                    <MdOutlineModeEdit
                                                        className='me-3'
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleStatusClick(
                                                            _id,
                                                            status
                                                        )
                                                    }
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        padding: 0,
                                                    }}>
                                                    {status === "active" ? (
                                                        <SiTicktick
                                                            style={{
                                                                cursor: "pointer",
                                                                color: "green",
                                                            }}
                                                        />
                                                    ) : (
                                                        <MdUpdateDisabled
                                                            style={{
                                                                cursor: "pointer",
                                                                color: "red",
                                                            }}
                                                        />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
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
