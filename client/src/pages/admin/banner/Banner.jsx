//admin banner page
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import PaginationButton from "../../../components/Pagination";
import { Form, Button, Card } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    bannerStatus,
    deleteBanner,
    getBanners,
    setCurrentPage,
} from "../../../features/banner/adminBannerSlice";
import "./banner.css";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useState, useEffect } from "react";
import { confirmAlert } from "../../../utils/confirmAlert";

const Banner = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loadingByAction, banner, currentPage, totalPages } = useSelector(
        (state) => state.adminBanner
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
        dispatch(getBanners({ page: currentPage, search: debouncedSearch }));
    }, [dispatch, currentPage, debouncedSearch]);

    const handleDeleteBanner = async (id) => {
        try {
            dispatch(deleteBanner(id));
        } catch (err) {
            alert('delete banner error, please try again');
        }
    };

    const handleStatusClick = async (id) => {
        const confirmed = await confirmAlert(
            "Delete the banner?",
            "Are you sure you want to delete the banner",
            "Submit",
            "Cancel"
        );

        if (confirmed) {
            handleDeleteBanner(id);
        }
    };

    const handleBannerStatus = async (id) => {
        try {
            await dispatch(bannerStatus(id)).unwrap();
        } catch (err) {
            alert('banner status change error, please try again');
        }
    };

    const handleBannerStatusClick = async (id, currentStatus) => {
        const confirmed = await confirmAlert(
            "Change banner status?",
            `Are you sure you want to ${
                currentStatus ? "deactivate" : "activate"
            } this banner?`,
            `${currentStatus ? "Deactivate" : "Activate"}`,
            "Cancel"
        );

        if (confirmed) {
            handleBannerStatus(id);
        }
    };

    return (
        <>
            {(loadingByAction.getBanners ||
                loadingByAction.deleteBanner ||
                loadingByAction.bannerStatus) && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container banner-container'>
                        <h2 className='mb-4 text-center text-lg-start'>
                            Banners
                        </h2>

                        {/* Search and Add button */}
                        <Form className='mb-4 mt-5'>
                            <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                                <div className='position-relative'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search Banners'
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className='rounded-pill ps-5 search-input'
                                    />
                                    <FaSearch className='search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
                                </div>
                                <Link to='/admin/add/banner'>
                                    <Button className='add-btn' variant='dark'>
                                        Add Banners
                                    </Button>
                                </Link>
                            </div>
                        </Form>

                        {/* Banner Cards */}
                        <div className='d-flex flex-column gap-3'>
                            {banner.map((banner) => (
                                <Card key={banner._id} className='banner-card'>
                                    <Card.Img
                                        src={banner.image}
                                        alt={banner.title}
                                        className='banner-image'
                                    />
                                    <Card.Body className='banner-body w-100'>
                                        <div>
                                            <Card.Title className='mb-1'>
                                                {banner.title}
                                            </Card.Title>
                                            <Card.Text
                                                className={
                                                    banner.isActive
                                                        ? "status-active"
                                                        : "status-deactivated"
                                                }>
                                                {banner.isActive
                                                    ? "Active"
                                                    : "Deactivated"}
                                            </Card.Text>

                                            <Card.Text className='text-muted small'>
                                                Started on:{" "}
                                                <span className='text-success'>
                                                    {new Date(
                                                        banner.startingDate
                                                    ).toDateString()}
                                                </span>{" "}
                                                | Ends in:{" "}
                                                <span className='text-danger'>
                                                    {new Date(
                                                        banner.endingDate
                                                    ).toDateString()}
                                                </span>
                                            </Card.Text>
                                        </div>
                                        <div className='d-flex gap-2 mt-3 mt-md-0'>
                                            <Button
                                                variant='primary'
                                                size='sm'
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/banner/edit/${banner._id}`
                                                    )
                                                }>
                                                Edit
                                            </Button>
                                            <Button
                                                variant='danger'
                                                size='sm'
                                                onClick={() =>
                                                    handleStatusClick(
                                                        banner._id
                                                    )
                                                }>
                                                Delete
                                            </Button>
                                            {banner.isActive ? (
                                                <Button
                                                    variant='warning'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleBannerStatusClick(
                                                            banner._id,
                                                            banner.isActive
                                                        )
                                                    }>
                                                    Deactivate
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant='success'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleBannerStatusClick(
                                                            banner._id,
                                                            banner.isActive
                                                        )
                                                    }>
                                                    Activate
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
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

export default Banner;
