import { Form, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import PaginationButton from "../../../components/Pagination";
import { useSelector, useDispatch } from "react-redux";
import {
    adminGetOrders,
    setCurrentPage,
} from "../../../features/orders/adminOrderSlice";
import { useEffect, useState, useMemo } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

const AdminOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, currentPage, totalPages, loadingByAction } = useSelector(
        (state) => state.adminOrder
    );

    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [search, setSearch] = useState("");

    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const [prevSearch, setPrevSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search !== prevSearch) {
                setDebouncedSearch(search);
                dispatch(setCurrentPage(1));
                setPrevSearch(search);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [dispatch, search, prevSearch]);

    useEffect(() => {
        dispatch(
            adminGetOrders({
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
                filterStatus,
                date: filterDate,
            })
        );
    }, [dispatch, currentPage, debouncedSearch, filterStatus, filterDate]);

    const processedOrders = useMemo(() => {
        return orders.map((order) => {
            const productNames = order.cartItems
                .map((item) => item.name)
                .join(", ");
            const totalQuantity = order.cartItems.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            const totalPrice = order.cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            return {
                ...order,
                productNames,
                totalQuantity,
                totalPrice,
            };
        });
    }, [orders]);

    return (
        <>
            {loadingByAction.adminGetOrders && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container'>
                        <h2 className='mb-4 text-center text-lg-start'>
                            Orders
                        </h2>

                        {/* Search & Filter Section */}
                        <Form className='mb-4 mt-5'>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                                {/* Search Input */}
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

                                {/* Filter Dropdown Button */}
                                <Dropdown align='end'>
                                    <Dropdown.Toggle
                                        variant='light'
                                        className='outline-secondary d-flex align-items-center gap-2'>
                                        <i className='bi bi-funnel'></i> Filters
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu
                                        className='p-3'
                                        style={{ minWidth: "220px" }}>
                                        {/* Status Filter */}
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select
                                                value={filterStatus}
                                                onChange={(e) => {
                                                    setFilterStatus(
                                                        e.target.value
                                                    );
                                                    dispatch(setCurrentPage(1));
                                                }}>
                                                <option value=''>All</option>
                                                <option value='PLACED'>
                                                    Placed
                                                </option>
                                                <option value='SHIPPED'>
                                                    Shipped
                                                </option>
                                                <option value='OUT FOR DELIVERY'>
                                                    Out for Delivery
                                                </option>
                                                <option value='DELIVERED'>
                                                    Delivered
                                                </option>
                                                <option value='CANCELLED'>
                                                    Cancelled
                                                </option>
                                                <option value='RETURNED'>
                                                    Returned
                                                </option>
                                                <option value='REFUNDED'>
                                                    Refunded
                                                </option>
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Date Filter */}
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control
                                                type='date'
                                                value={filterDate}
                                                onChange={(e) => {
                                                    setFilterDate(
                                                        e.target.value
                                                    );
                                                    dispatch(setCurrentPage(1));
                                                }}
                                            />
                                        </Form.Group>

                                        {/* Clear Filters Button */}
                                        <div className='d-flex justify-content-end'>
                                            <button
                                                type='button'
                                                className='btn btn-sm btn-outline-secondary rounded-pill'
                                                onClick={() => {
                                                    setFilterStatus("");
                                                    setFilterDate("");
                                                    dispatch(setCurrentPage(1));
                                                }}>
                                                Clear
                                            </button>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Form>

                        {/* Orders Table */}
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Products</th>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Total Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody style={{ cursor: "pointer" }}>
                                {processedOrders.length > 0 ? (
                                    processedOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            onClick={() =>
                                                navigate(
                                                    `/admin/order/detail/${order._id}`
                                                )
                                            }>
                                            <td>{order.productNames}</td>
                                            <td>{order.orderNumber}</td>
                                            <td>
                                                {new Date(
                                                    order.createdAt
                                                ).toDateString()}
                                            </td>
                                            <td>{order.user?.name}</td>
                                            <td>{order.totalQuantity}</td>
                                            <td>₹{order.totalPrice}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className='text-center text-muted'>
                                            No orders found
                                        </td>
                                    </tr>
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

export default AdminOrders;
