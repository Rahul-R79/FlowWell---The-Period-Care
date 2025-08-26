import {
    Navbar,
    Nav,
    Container,
    Form,
    Offcanvas,
    Row,
    Col,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { searchProducts } from "../../features/products/userProductSlice";
import { FaRegHeart } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import "./header.css";
import { useEffect, useState } from "react";
import { getWishlist } from "../../features/wishlistSlice";
import { getCart } from "../../features/cartSlice";

export default function UserHeader() {
    const { user } = useSelector((state) => state.auth);
    const { searchResults } = useSelector((state) => state.userProducts);
    const { totalWishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const query = debouncedSearch.trim();
        if (query) {
            dispatch(searchProducts({ q: query }));
        }
    }, [dispatch, debouncedSearch]);

    useEffect(() => {
        dispatch(getWishlist({ page: 1, limit: 3 }));
        dispatch(getCart());
    }, [dispatch]);

    return (
        <header className='container'>
            {["lg"].map((expand) => (
                <Navbar
                    key={expand}
                    bg='white'
                    expand={expand}
                    className='py-3'>
                    <Container>
                        <Navbar.Brand href='#' className='fw-semibold fs-4'>
                            FlowWell
                        </Navbar.Brand>
                        {/* Mobile Hamburger */}
                        <Navbar.Toggle
                            aria-controls={`offcanvasNavbar-expand-${expand}`}
                        />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement='end'>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title
                                    id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    FlowWell
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Row className='align-items-center w-100 g-3'>
                                    {/* Nav Links */}
                                    <Col xs={12} lg='auto'>
                                        <Nav className='fw-semibold justify-content-lg-start flex-lg-row flex-column text-center'>
                                            <Nav.Link href='/'>Home</Nav.Link>
                                            <Nav.Link href='/user/product'>
                                                Products
                                            </Nav.Link>
                                            <Nav.Link href='/user/product'>
                                                New Arrivals
                                            </Nav.Link>
                                            <Nav.Link href='#'>About</Nav.Link>
                                        </Nav>
                                    </Col>

                                    {/* Search bar*/}
                                    <Col xs={12} lg>
                                        <Form className='d-flex align-items-center position-relative my-2 my-lg-0 search-bar'>
                                            <FaSearch className='text-muted me-2' />
                                            <Form.Control
                                                type='text'
                                                placeholder='Search for products...'
                                                className='border-0 bg-transparent shadow-none custom-placeholder'
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                            />
                                            {search && (
                                                <IoMdClose
                                                    size={20}
                                                    className='search-close'
                                                    onClick={() =>
                                                        setSearch("")
                                                    }
                                                />
                                            )}
                                        </Form>

                                        {search &&
                                            searchResults &&
                                            searchResults.length > 0 && (
                                                <div className='search-results position-absolute bg-white border rounded shadow p-2'>
                                                    {searchResults.map(
                                                        (product) => (
                                                            <Link
                                                                key={
                                                                    product._id
                                                                }
                                                                to={`/user/productdetail/${product._id}`}
                                                                className='d-flex align-items-center text-dark py-2 px-2 hover-bg search-text'>
                                                                <img
                                                                    src={
                                                                        product
                                                                            .images[0]
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className='me-2 search-product-img'
                                                                />
                                                                <span>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </span>
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </Col>

                                    {/* signin */}
                                    <Col
                                        xs={12}
                                        lg='auto'
                                        className='d-flex justify-content-lg-end justify-content-center align-items-center gap-3'>
                                        <Link to={"/profile"}>
                                            <CgProfile
                                                size={28}
                                                className='text-dark'
                                            />
                                        </Link>
                                        {user ? (
                                            <>
                                                <Link
                                                    to='/wishlist'
                                                    className='position-relative'>
                                                    <FaRegHeart
                                                        size={24}
                                                        className='text-danger'
                                                        title='Wishlist'
                                                    />
                                                    {totalWishlist > 0 && (
                                                        <span
                                                            className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
                                                            style={{
                                                                fontSize:
                                                                    "0.65rem",
                                                            }}>
                                                            {totalWishlist}
                                                        </span>
                                                    )}
                                                </Link>
                                                <Link
                                                    to='/cart'
                                                    className='position-relative'>
                                                    <BsCart3
                                                        size={24}
                                                        className='text-dark'
                                                        title='Cart'
                                                    />
                                                    {cart.products?.length >
                                                        0 && (
                                                        <span
                                                            className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
                                                            style={{
                                                                fontSize:
                                                                    "0.65rem",
                                                            }}>
                                                            {cart.products?.length}
                                                        </span>
                                                    )}
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                to={"/signup"}
                                                className='btn btn-outline-dark px-4'>
                                                {" "}
                                                Sign Up{" "}
                                            </Link>
                                        )}
                                    </Col>
                                </Row>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </header>
    );
}
