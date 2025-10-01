//user wishlist page
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { Row, Col, Button, Image } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import "./wishlist.css";
import PaginationButton from "../../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
    getWishlist,
    removeFromWishlist,
} from "../../../features/wishlistSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useEffect } from "react";
import ToastNotification, {
    showErrorToast,
    showSuccessToast,
} from "../../../components/ToastNotification";
import { confirmAlert } from "../../../utils/confirmAlert";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../features/cartSlice";

function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loadingByAction, wishlist, currentPage, totalPages } = useSelector(
        (state) => state.wishlist
    );

    const handlePageChange = (page) => {
        dispatch(getWishlist({ page, limit: 3 }));
    };

    const handleRemoveFromWishlist = async (id) => {
        try {
            await dispatch(
                removeFromWishlist({
                    productId: id,
                    page: currentPage,
                    limit: 3,
                })
            ).unwrap();
            showErrorToast("Removed from wishlist!");
        } catch (err) {}
    };

    const handleDeleteClick = async (id) => {
        const confirmed = await confirmAlert(
            "Delete from Wishlist?",
            "Are you sure you want to delete from the wishlist",
            "Delete",
            "Cancel"
        );

        if (confirmed) {
            handleRemoveFromWishlist(id);
        }
    };

    const handleAddToCart = async (item) => {
        try {
            const { product, selectedSize } = item;
            const quantity = 1;
            await dispatch(
                addToCart({ productId: product._id, quantity, selectedSize })
            ).unwrap();

            await dispatch(
                removeFromWishlist({
                    productId: product._id,
                    page: currentPage,
                    limit: 3,
                })
            ).unwrap();
            showSuccessToast("Added to cart!");
            setTimeout(() => {
                navigate("/cart");
            }, 500);
        } catch (err) {}
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    return (
        <>
            {(loadingByAction.getWishlist ||
                loadingByAction.removeFromWishlist) && <LoadingSpinner />}
            <UserHeader />
            <ToastNotification />
            <section className='wishlist container'>
                <h3 className='mb-4 fw-bold'>My Wishlist</h3>
                {wishlist.products?.length > 0 ? (
                    wishlist.products.map((item) => (
                        <Row
                            key={item.product._id}
                            className='align-items-center mx-auto border rounded p-3 mb-3 shadow-sm container'>
                            {/* Product Image */}
                            <Col xs={4} md={2} className='text-center'>
                                <Image
                                    src={item.product.images?.[0]}
                                    alt={item.product.name}
                                    fluid
                                    rounded
                                />
                            </Col>

                            {/* Product Info */}
                            <Col xs={8} md={6}>
                                <h5 className='fw-semibold'>
                                    {item.product.name}
                                </h5>
                                <p className='mb-1'>
                                    Size:{" "}
                                    {item.selectedSize.charAt(0).toUpperCase() +
                                        item.selectedSize.slice(1)}
                                </p>
                                <p>
                                    ₹
                                    {item.product.basePrice -
                                        (item.product.discountPrice || 0)}
                                </p>
                                <p
                                    className={`fw-bold ${
                                        item.product.sizes.find(
                                            (s) =>
                                                s.size === item.selectedSize &&
                                                s.stock > 0
                                        )
                                            ? "text-success"
                                            : "text-danger"
                                    }`}>
                                    {item.product.sizes.find(
                                        (s) =>
                                            s.size === item.selectedSize &&
                                            s.stock > 0
                                    )
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </p>
                            </Col>

                            {/* Actions */}
                            <Col
                                xs={12}
                                md={4}
                                className='d-flex justify-content-md-end justify-content-between mt-3 mt-md-0'>
                                <Button
                                    variant='dark'
                                    size='sm'
                                    className='me-3'
                                    disabled={
                                        !item.product.sizes.find(
                                            (s) =>
                                                s.size === item.selectedSize &&
                                                s.stock > 0
                                        )
                                    }
                                    onClick={() => handleAddToCart(item)}>
                                    Add to Cart
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleDeleteClick(item.product._id)
                                    }
                                    variant='link'
                                    className='text-danger fs-5'>
                                    <FaTrash />
                                </Button>
                            </Col>
                        </Row>
                    ))
                ) : (
                    <p>No items in wishlist.</p>
                )}

                {wishlist.products?.length > 0 && (
                    <PaginationButton
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>
            <Footer />
        </>
    );
}

export default Wishlist;
