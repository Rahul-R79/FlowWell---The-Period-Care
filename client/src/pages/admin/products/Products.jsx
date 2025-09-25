//admin product page
import { Form, Button, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { MdUpdateDisabled } from "react-icons/md";
import { Link } from "react-router-dom";
import {
    getProduct,
    productToggleStatus,
    setCurrentPage,
} from "../../../features/products/adminProductSlice";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import "./products.css";
import { useEffect, useState } from "react";
import PaginationButton from "../../../components/Pagination";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { confirmAlert } from "../../../utils/confirmAlert";

const ProductsPage = () => {
    const { products, currentPage, totalPages, loadingByAction } = useSelector(
        (state) => state.adminProducts
    );
    const dispatch = useDispatch();
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
        dispatch(getProduct({ page: currentPage, search: debouncedSearch }));
    }, [dispatch, currentPage, debouncedSearch]);

    const handlechangeStatus = async (id) => {
        try {
            await dispatch(productToggleStatus(id)).unwrap();
        } catch (err) {
        }
    };

    const handleStatusClick = async (id, isActive) => {
        const confirmed = await confirmAlert(
            "Change Status?",
            `Are you sure you want to ${
                isActive ? "deactivate" : "activate"
            } this product?`,
            "Submit",
            "Cancel"
        );

        if (confirmed) {
            handlechangeStatus(id);
        }
    };

    return (
        <>
            {loadingByAction.getProduct && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container product-container'>
                        <h2 className='mb-4 text-center text-lg-start'>
                            Products
                        </h2>

                        {/* Search & Add button */}
                        <Form className='mb-4 mt-5'>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                                <div className='position-relative'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search here'
                                        className='rounded-pill ps-5 search-input'
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <FaSearch className='search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
                                </div>
                                <Link to='/admin/products/add'>
                                    <Button className='add-btn' variant='dark'>
                                        Add Product
                                    </Button>
                                </Link>
                            </div>
                        </Form>

                        {/* Products table */}
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Sizes</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Total Stock</th>
                                    <th>Added On</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(
                                    ({
                                        _id,
                                        name,
                                        sizes,
                                        basePrice,
                                        category,
                                        createdAt,
                                        isActive,
                                    }) => (
                                        <tr key={_id}>
                                            <td>{name}</td>
                                            <td className='text-primary'>
                                                {sizes.map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className='product-size'>
                                                        {s.size.length >= 3
                                                            ? s.size
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : s.size.toUpperCase()}
                                                    </span>
                                                ))}
                                            </td>

                                            <td>₹{basePrice}</td>
                                            <td>{category.name}</td>
                                            <td className='text-primary'>
                                                {sizes
                                                    .map((s) => s.stock)
                                                    .reduce(
                                                        (acc, curr) =>
                                                            acc + curr,
                                                        0
                                                    )}
                                            </td>
                                            <td>
                                                {new Date(
                                                    createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <Button
                                                    size='sm'
                                                    variant={
                                                        isActive
                                                            ? "outline-success"
                                                            : "outline-danger"
                                                    }
                                                    style={{ width: 80 }}
                                                    disabled>
                                                    {isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Button>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/admin/products/edit/${_id}`}
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
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        padding: 0,
                                                    }}
                                                    onClick={() =>
                                                        handleStatusClick(
                                                            _id,
                                                            isActive
                                                        )
                                                    }>
                                                    {isActive ? (
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

export default ProductsPage;
