//user products page
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import {
    getUserProducts,
    setFilters,
    setCurrentPage,
    clearProducts,
} from "../../../features/products/userProductSlice";
import UserHeader from "../../../components/Header/UserHeader";
import Footer from "../../../components/Footer/UserFooter";
import PaginationButton from "../../../components/Pagination";
import "./userProduct.css";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

function ProductPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, filters, currentPage, totalPages, loadingByAction } =
        useSelector((state) => state.userProducts);

    const [selectedSort, setSelectedSort] = useState(null);
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState([]);

    useEffect(() => {
        dispatch(getUserProducts(filters));
        window.scrollTo(0, 0);
    }, [dispatch, filters]);

    const handleApplyFilters = () => {
        dispatch(
            setFilters({
                sortBy: selectedSort?.value || "",
                size: selectedSize.map((s) => s.value),
                price: selectedPrice?.value || "",
                categoryName: selectedCategory?.value || "",
                offer: selectedOffer.map((o) => o.value),
            })
        );
    };

    const handleCategoryClick = (categoryName) => {
        dispatch(setFilters({ categoryName }));
    };

    const clearAllfilters = () => {
        dispatch(clearProducts());
        setSelectedSort(null);
        setSelectedSize([]);
        setSelectedCategory(null);
        setSelectedPrice(null);
        setSelectedOffer([]);
    };

    const productDetailById = (id) => {
        navigate(`/user/productdetail/${id}`);
    };

    const sortOptions = [
        { value: "priceLowToHigh", label: "Price: Low to High" },
        { value: "priceHighToLow", label: "Price: High to Low" },
        { value: "aToZ", label: "Alphabetic: A-Z" },
        { value: "zToA", label: "Alphabetic: Z-A" },
        { value: "newArrivals", label: "Newest Arrivals" },
        { value: "rating", label: "Customer Ratings" },
    ];

    const sizeOptions = [
        { value: "regular", label: "Regular" },
        { value: "medium", label: "M" },
        { value: "large", label: "L" },
        { value: "xl", label: "XL" },
    ];

    const priceOptions = [
        { value: "under500", label: "Under ₹500" },
        { value: "500to1000", label: "₹500 - ₹1000" },
        { value: "1000to2500", label: "₹1000 - ₹2500" },
        { value: "above2500", label: "Above ₹2500" },
    ];

    const giftOptions = [
        { value: "Gift Hampers Standard", label: "Standard" },
        { value: "Gift Hampers Premium", label: "Premium" },
        { value: "Gift Hampers Exclusive", label: "Exclusive" },
    ];

    const offerOptions = [
        { value: "FLAT", label: "50% Off" },
        { value: "BOGO", label: "Buy 1 Get 1" },
    ];

    return (
        <>
            {loadingByAction.getUserProducts && <LoadingSpinner />}
            <UserHeader />
            <section className='product-page container my-5'>
                <Row>
                    <Col lg={3} md={4} sm={12} className='mb-4'>
                        <div className='sticky-filter'>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h5>Filters</h5>
                                <h6
                                    className='clear-btn'
                                    style={{ cursor: "pointer" }}
                                    onClick={clearAllfilters}>
                                    Clear All
                                </h6>
                            </div>

                            <div className='mb-3'>
                                <label>Sort By</label>
                                <Select
                                    options={sortOptions}
                                    value={selectedSort}
                                    onChange={setSelectedSort}
                                    placeholder='Sort By'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Size</label>
                                <Select
                                    options={sizeOptions}
                                    value={selectedSize}
                                    onChange={setSelectedSize}
                                    isMulti
                                    placeholder='Select Size'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Price</label>
                                <Select
                                    options={priceOptions}
                                    value={selectedPrice}
                                    onChange={setSelectedPrice}
                                    placeholder='Select Price'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Gift Hampers</label>
                                <Select
                                    options={giftOptions}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    placeholder='Gift Hampers'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Offers</label>
                                <Select
                                    options={offerOptions}
                                    value={selectedOffer}
                                    onChange={setSelectedOffer}
                                    isMulti
                                    placeholder='Offers'
                                />
                            </div>

                            <Button
                                variant='dark'
                                className='w-100'
                                onClick={handleApplyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </Col>

                    <Col lg={9} md={8} sm={12}>
                        <h4 className='mb-3'>All Products</h4>

                        <div className='mb-4 d-flex flex-wrap gap-2'>
                            {[
                                "All",
                                "Sanitary Pads",
                                "Menstrual Cups",
                                "Tampons",
                                "Period Kits",
                            ].map((cat) => (
                                <Button
                                    key={cat}
                                    variant='outline-dark'
                                    onClick={() =>
                                        handleCategoryClick(
                                            cat === "All" ? "" : cat
                                        )
                                    }>
                                    {cat}
                                </Button>
                            ))}
                        </div>

                        <Row xs={1} sm={2} md={3} className='g-4'>
                            {loadingByAction.getUserProducts ? (
                                <LoadingSpinner />
                            ) : products.length === 0 ? (
                                <p>No products found.</p>
                            ) : (
                                products.map((product) => (
                                    <Col
                                        key={product._id}
                                        className='text-left'>
                                        <div
                                            className='product-card'
                                            onClick={() =>
                                                productDetailById(product._id)
                                            }>
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className='product-img'
                                            />
                                            <div className='mt-2 product-category'>
                                                <h5>{product.name}</h5>
                                                <p className='mb-0'>
                                                    {product.categoryName}
                                                </p>
                                                <div className='product-sizes d-flex align-items-center'>
                                                    Size:
                                                    {product.sizes.map(
                                                        (s, index) => (
                                                            <span
                                                                key={index}
                                                                className='size-box'>
                                                                {s.size
                                                                    .length <= 3
                                                                    ? s.size.toUpperCase()
                                                                    : s.size
                                                                          .charAt(
                                                                              0
                                                                          )
                                                                          .toUpperCase()}
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                                <div className='product-pricing mt-2'>
                                                    {product.finalPrice <
                                                    product.basePrice ? (
                                                        <p className='base-price'>
                                                            ₹{product.basePrice}
                                                        </p>
                                                    ) : null}

                                                    <p className='final-price'>
                                                        ₹{product.finalPrice}
                                                    </p>

                                                    {/* If discounted, show savings */}
                                                    {product.finalPrice <
                                                        product.basePrice && (
                                                        <p className='savings'>
                                                            You save ₹
                                                            {product.basePrice -
                                                                product.finalPrice}
                                                        </p>
                                                    )}

                                                    {/* Offer Badge */}
                                                    {product.offer && (
                                                        <span className='offer-badge'>
                                                            {product.offer ===
                                                            "FLAT"
                                                                ? "Flat 50% Off"
                                                                : product.offer}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>

                        <div className='mt-5'>
                            <PaginationButton
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) =>
                                    dispatch(setCurrentPage(page))
                                }
                            />
                        </div>
                    </Col>
                </Row>
            </section>
            <Footer />
        </>
    );
}

export default ProductPage;
