import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { useNavigate } from "react-router-dom";

function UserPageNotFound() {
    const navigate = useNavigate();

    const backToHome = () => {
        navigate("/", { replace: true });
    };

    return (
        <>
            <UserHeader />
            <section
                className='UserpageNotFound'
                style={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                    textAlign: "center",
                    padding: "2rem",
                }}>
                <Container>
                    <Row className='justify-content-center'>
                        <Col md={8}>
                            <motion.h1
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                }}
                                style={{
                                    fontSize: "8rem",
                                    fontWeight: "bold",
                                    color: "#ff4d6d",
                                }}>
                                404
                            </motion.h1>

                            <motion.h3
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}>
                                Oops! Page Not Found
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}>
                                The page you are looking for doesn’t exist or
                                has been moved.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant='danger'
                                    onClick={backToHome}
                                    style={{ marginTop: "1rem" }}>
                                    Go Back Home
                                </Button>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    );
}

export default UserPageNotFound;
