import { Form, Button, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { MdUpdateDisabled } from "react-icons/md";
import { Link } from "react-router-dom";

import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import "./products.css";

const ProductsPage = () => {
    const products = [
        {
            name: "Menstrual Cups",
            id: "BS6FXA5E",
            price: 50,
            category: "Cups",
            stock: 40,
            addedOn: "01-04-2025",
            status: "active",
        },
        {
            name: "Menstrual Cups",
            id: "BS6FXB5T",
            price: 90,
            category: "Cups",
            stock: 40,
            addedOn: "01-04-2025",
            status: "inactive",
        },
        {
            name: "Menstrual Cups",
            id: "BS6FXC2K",
            price: 60,
            category: "Cups",
            stock: 40,
            addedOn: "01-04-2025",
            status: "active",
        },
        {
            name: "Menstrual Cups",
            id: "BS6FXD2O",
            price: 50,
            category: "Cups",
            stock: 40,
            addedOn: "01-04-2025",
            status: "active",
        },
        {
            name: "Menstrual Cups",
            id: "BS6FXA8Q",
            price: 100,
            category: "Cups",
            stock: 40,
            addedOn: "01-04-2025",
            status: "inactive",
        },
    ];

    return (
        <div className='d-flex flex-column flex-lg-row min-vh-100'>
            <Sidebar />
            <div className='flex-grow-1 d-flex flex-column main-content'>
                <div className='flex-grow-1 py-4 d-flex flex-column container product-container'>
                    <h4 className='mb-4 text-center text-lg-start'>Products</h4>

                    {/* Search & Add button */}
                    <Form className='mb-4'>
                        <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                            <div className='position-relative'>
                                <Form.Control
                                    type='text'
                                    placeholder='Search here'
                                    className='rounded-pill ps-5 search-input'
                                />
                                <FaSearch className='search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
                            </div>
                            <Link to='/products/add'>
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
                                <th>Product ID</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Added On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(
                                ({
                                    id,
                                    name,
                                    price,
                                    category,
                                    stock,
                                    addedOn,
                                    status,
                                }) => (
                                    <tr key={id}>
                                        <td>{name}</td>
                                        <td className='text-primary'>{id}</td>
                                        <td>${price}</td>
                                        <td>{category}</td>
                                        <td>{stock}</td>
                                        <td>{addedOn}</td>
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
                                                to={'/products/edit'}
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
                <AdminFooter />
            </div>
        </div>
    );
};

export default ProductsPage;
