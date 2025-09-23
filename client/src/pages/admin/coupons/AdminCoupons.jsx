//admin coupons
import { Form, Button, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { MdUpdateDisabled } from "react-icons/md";
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { Link } from "react-router-dom";
import PaginationButton from "../../../components/Pagination";
import "./adminCoupon.css";
import { useSelector, useDispatch } from "react-redux";
import {
    changeCouponStatus,
    getCoupons,
    setCurrentPage,
} from "../../../features/coupons/adminCouponSlice";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { confirmAlert } from "../../../utils/confirmAlert";

const AdminCoupons = () => {
    const dispatch = useDispatch();
    const { coupons, loadingByAction, currentPage, totalPages } = useSelector(
        (state) => state.adminCoupon
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
        dispatch(getCoupons({ page: currentPage, search: debouncedSearch }));
    }, [dispatch, currentPage, debouncedSearch]);

    const handleChangeCouponStatus = async (id) => {
        try {
            await dispatch(changeCouponStatus(id)).unwrap();
        } catch (err) {
            alert('change coupon error, please try again');
        }
    };

    const handleStatusClick = async (id, currentStatus) => {
        const confirmed = await confirmAlert(
            "Change Coupon Status?",
            `Are you sure you want to ${
                currentStatus ? "deactivate" : "activate"
            } this coupon?`,
            "Submit",
            "Cancel"
        );

        if (confirmed) {
            handleChangeCouponStatus(id);
        }
    };

    return (
        <>
            {(loadingByAction.getCoupons ||
                loadingByAction.changeCouponStatus) && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container coupon-container'>
                        <h2 className='mb-4 text-center text-lg-start'>
                            Coupons
                        </h2>

                        {/* Search and Add button */}
                        <Form className='mb-4 mt-5'>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                                <div className='position-relative'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search Coupons'
                                        className='rounded-pill ps-5 search-input'
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <FaSearch className='search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
                                </div>
                                <Link to='/admin/add/coupon'>
                                    <Button className='add-btn' variant='dark'>
                                        Add Coupons
                                    </Button>
                                </Link>
                            </div>
                        </Form>

                        {/* Products table */}
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Coupon Name</th>
                                    <th>Coupon Code</th>
                                    <th>Activate Date</th>
                                    <th>Expire Date</th>
                                    <th>Usage Limit</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((coupon) => (
                                    <tr key={coupon._id}>
                                        <td>{coupon.couponName}</td>
                                        <td>
                                            <span className='coupon-code'>
                                                {coupon.couponCode}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(
                                                coupon.createdAt
                                            ).toDateString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                coupon.expirationDate
                                            ).toDateString()}
                                        </td>
                                        <td>{coupon.usageLimit}</td>
                                        <td>
                                            <Button
                                                size='sm'
                                                variant={
                                                    coupon.isActive
                                                        ? "outline-success"
                                                        : "outline-danger"
                                                }
                                                style={{ width: 80 }}
                                                disabled>
                                                {coupon.isActive
                                                    ? "Active"
                                                    : "Disabled"}
                                            </Button>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/edit/coupon/${coupon._id}`}
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
                                                        coupon._id,
                                                        coupon.isActive
                                                    )
                                                }
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                }}>
                                                {coupon.isActive ? (
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

export default AdminCoupons;
