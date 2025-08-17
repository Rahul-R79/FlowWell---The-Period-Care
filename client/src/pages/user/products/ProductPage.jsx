import { Container, Row, Col, Button } from "react-bootstrap";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import Select from "react-select";
import "./userProduct.css";

const products = [
    {
        id: 1,
        name: "Flowell Menstrual Pads",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Pads",
        size: "Regular",
        price: "₹250",
    },
    {
        id: 2,
        name: "Flowell Menstrual Pads",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Pads",
        size: "Regular",
        price: "₹250",
    },
    {
        id: 3,
        name: "Flowell Period Panty",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Panty",
        size: "M",
        price: "₹450",
    },
    {
        id: 4,
        name: "Flowell Period Panty",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Panty",
        size: "L",
        price: "₹450",
    },
    {
        id: 5,
        name: "Flowell Heat Pad",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Pain Relief",
        size: "Regular",
        price: "₹150",
    },
    {
        id: 6,
        name: "Flowell Menstrual Kit",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Kit",
        size: "Regular",
        price: "₹999",
    },
    {
        id: 7,
        name: "Flowell Menstrual Cup",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Cup",
        size: "Soft",
        price: "₹799",
    },
    {
        id: 8,
        name: "Flowell Menstrual Kit",
        image: "/images/products/cups/flowwell-cups-01.webp",
        type: "Kit",
        size: "Regular",
        price: "₹999",
    },
];

// Dropdown options
const sortOptions = [
    { value: "lowToHigh", label: "Price: Low to High" },
    { value: "highToLow", label: "Price: High to Low" },
    { value: "a-z", label: "Alphabetic: A-Z" },
    { value: "z-a", label: "Alphabetic: Z-A" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "rating", label: "Customer Ratings" },
];

const sizeOptions = [
    { value: "regular", label: "Regular" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
];

const priceOptions = [
    { value: "under200", label: "Under ₹500" },
    { value: "200to500", label: "₹500 - ₹1000" },
    { value: "500to1000", label: "₹1000 - ₹2500" },
    { value: "above1000", label: "Above ₹2500" },
];

const giftOptions = [
    { value: "Standard", label: "Standard" },
    { value: "Premium", label: "Premium" },
    { value: "Exclusive", label: "Exclusive" },
];

const offerOptions = [
    { value: "50off", label: "50% Off" },
    { value: "b1g1", label: "Buy 1 Get 1" }
];

function ProductPage() {
    return (
        <>
            <UserHeader />
            <section className='product-page container my-5'>
                <Row>
                    {/* Left Filter Column */}
                    <Col lg={3} md={4} sm={12} className='mb-4'>
                        <div className='sticky-filter'>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h5>Filters</h5>
                                <h6
                                    className='clear-btn'
                                    style={{ cursor: "pointer" }}>
                                    Clear All
                                </h6>
                            </div>

                            <div className='mb-3'>
                                <label>Sort By</label>
                                <Select
                                    options={sortOptions}
                                    placeholder='Sort By'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Size</label>
                                <Select
                                    options={sizeOptions}
                                    placeholder='Select Size'
                                    isMulti
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Price</label>
                                <Select
                                    options={priceOptions}
                                    placeholder='Select Price'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Gift Hampers</label>
                                <Select
                                    options={giftOptions}
                                    placeholder='Gift Hampers'
                                />
                            </div>

                            <div className='mb-3'>
                                <label>Offers</label>
                                <Select
                                    options={offerOptions}
                                    placeholder='Offers'
                                    isMulti
                                />
                            </div>

                            <Button variant='dark' className='w-100'>
                                Apply Filters
                            </Button>
                        </div>
                    </Col>

                    {/* Product Listing */}
                    <Col lg={9} md={8} sm={12}>
                        <h4 className='mb-3'>All Products</h4>

                        {/* Category Buttons */}
                        <div className='mb-4 d-flex flex-wrap gap-2'>
                            <Button variant='outline-dark'>All</Button>
                            <Button variant='outline-dark'>
                                Menstrual Pads
                            </Button>
                            <Button variant='outline-dark'>
                                Menstrual Cups
                            </Button>
                            <Button variant='outline-dark'>Period Panty</Button>
                            <Button variant='outline-dark'>
                                Menstrual Kit
                            </Button>
                        </div>

                        <Row xs={1} sm={2} md={3} className='g-4'>
                            {products.map((product) => (
                                <Col key={product.id} className='text-left'>
                                    <div className='product-card'>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className='product-img'
                                        />
                                        <div className='mt-2 product-category'>
                                            <h5 className='mt-2'>
                                                {product.name}
                                            </h5>
                                            <p className='mb-0'>
                                                {product.type}
                                            </p>
                                            <p className='mb-0'>
                                                Size: {product.size}
                                            </p>
                                            <p className='mb-0 fw-bold'>
                                                Price: {product.price}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </section>
            <Footer />
        </>
    );
}

export default ProductPage;
