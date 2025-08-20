import { motion } from "framer-motion";
import { Button, Container, Row, Col } from "react-bootstrap";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { useNavigate } from "react-router-dom";

function AdminPageNotFound() {
    const navigate = useNavigate();

    const backToDashboard = () => {
        navigate("/admin/dashboard", { replace: true });
    };

    return (
        <>
            <section
                className='adminPagenotFound'
                style={{
                    minHeight: "90vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                }}>
                <Container>
                    <Row className='text-center'>
                        <Col>
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
                                    color: "#dc3545",
                                }}>
                                404
                            </motion.h1>
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}>
                                Oops! Page Not Found
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}>
                                The page you're looking for doesn't exist or has
                                been moved.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}>
                                <Button
                                    variant='danger'
                                    onClick={backToDashboard}>
                                    Go Back to Dashboard
                                </Button>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <AdminFooter />
        </>
    );
}

export default AdminPageNotFound;
