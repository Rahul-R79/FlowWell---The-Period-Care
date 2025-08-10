import { Navbar, Nav, Container, Form, Offcanvas, Row, Col } from "react-bootstrap";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import {Link} from "react-router-dom"
import "./header.css";

export default function Header() {
    return (
        <header className="container">
        {["lg"].map((expand) => (
            <Navbar key={expand} bg="white" expand={expand} className="py-3">
            <Container>
                <Navbar.Brand href="#" className="fw-semibold fs-4">FlowWell</Navbar.Brand>
                {/* Mobile Hamburger */}
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                    <Navbar.Offcanvas id={`offcanvasNavbar-expand-${expand}`} 
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`} 
                    placement="end">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>FlowWell</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Row className="align-items-center w-100 g-3">
                                {/* Nav Links */}
                                <Col xs={12} lg="auto">
                                    <Nav className="fw-semibold justify-content-lg-start flex-lg-row flex-column text-center">
                                        <Nav.Link href="#">Home</Nav.Link>
                                        <Nav.Link href="#">Products</Nav.Link>
                                        <Nav.Link href="#">New Arrivals</Nav.Link>
                                        <Nav.Link href="#">About</Nav.Link>
                                    </Nav>
                                </Col>

                                {/* Search */}
                                <Col xs={12} lg>
                                    <Form className="search-bar m-auto">
                                    <FaSearch className="text-muted me-2" />
                                    <Form.Control
                                        type="text"
                                        placeholder="Search for products..."
                                        className="border-0 bg-transparent shadow-none custom-placeholder"
                                    />
                                    </Form>
                                </Col>

                                {/* signin */}
                                <Col xs={12} lg="auto" className="d-flex justify-content-lg-end justify-content-center align-items-center gap-3">
                                    <FaUserCircle size={28} className="text-dark" />
                                    <Link to={'/signup'} className="btn btn-outline-dark px-4"> Sign Up </Link>
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
