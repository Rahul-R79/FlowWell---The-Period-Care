//user footer
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaGithub,
    FaEnvelope,
} from "react-icons/fa";
import "./footer.css";

const Footer = () => {
    return (
        <footer className='footer-section'>
            {/* Newsletter Section */}
            <div className='newsletter-section container px-4 py-4 mx-auto'>
                <Container>
                    <Row className='align-items-center justify-content-between'>
                        <Col xs={12} md={6} className='newsletter-text'>
                            <h2>
                                STAY UPTO DATE ABOUT
                                <br />
                                OUR LATEST OFFERS
                            </h2>
                        </Col>
                        <Col xs={12} lg={4} md={6}>
                            <Form className='newsletter-form'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>
                                        <FaEnvelope />
                                    </span>
                                    <Form.Control
                                        type='email'
                                        placeholder='Enter your email address'
                                        className='custom-placeholder'
                                    />
                                </div>
                                <Button
                                    variant='light'
                                    className='subscribe-btn'>
                                    Subscribe to Newsletter
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Main Footer */}
            <Container className='main-footer px-4'>
                <Row>
                    {/* Left Section */}
                    <Col xs={12} md={4} className='footer-brand'>
                        <h3>FlowWell</h3>
                        <p>
                            Designed for comfort, built for confidence — because
                            your period shouldn't hold you back.
                        </p>
                        <div className='social-icons'>
                            <a href='#'>
                                <FaTwitter />
                            </a>
                            <a href='#'>
                                <FaFacebookF />
                            </a>
                            <a href='#'>
                                <FaInstagram />
                            </a>
                            <a href='#'>
                                <FaGithub />
                            </a>
                        </div>
                    </Col>

                    {/* Company */}
                    <Col xs={6} md={2} className='footer-links'>
                        <h6>COMPANY</h6>
                        <ul>
                            <li>
                                <a href='#'>About</a>
                            </li>
                            <li>
                                <a href='#'>Contact Us</a>
                            </li>
                            <li>
                                <a href='#'>Works</a>
                            </li>
                        </ul>
                    </Col>

                    {/* Help */}
                    <Col xs={6} md={3} className='footer-links'>
                        <h6>HELP</h6>
                        <ul>
                            <li>
                                <a href='#'>Customer Support</a>
                            </li>
                            <li>
                                <a href='#'>Delivery Details</a>
                            </li>
                            <li>
                                <a href='#'>Terms & Conditions</a>
                            </li>
                            <li>
                                <a href='#'>Privacy Policy</a>
                            </li>
                        </ul>
                    </Col>

                    {/* FAQ */}
                    <Col xs={6} md={3} className='footer-links'>
                        <h6>FAQ</h6>
                        <ul>
                            <li>
                                <a href='#'>Account</a>
                            </li>
                            <li>
                                <a href='#'>Orders</a>
                            </li>
                            <li>
                                <a href='#'>Payments</a>
                            </li>
                        </ul>
                    </Col>
                </Row>

                {/* Bottom Section */}
                <Row className='footer-bottom align-items-center'>
                    <Col md={6}>
                        <p>FlowWell © 2025-2026, All Rights Reserved</p>
                    </Col>
                    <Col md={6} className='payment-icons text-md-end'>
                        <img src='/images/icons/card.webp' alt='MasterCard' />
                        <img src='/images/icons/google-pay.webp' alt='gpay' />
                        <img
                            src='/images/icons/razorpay-icon.webp'
                            alt='razorpay'
                        />
                        <img src='/images/icons/visa.webp' alt='visa' />
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
