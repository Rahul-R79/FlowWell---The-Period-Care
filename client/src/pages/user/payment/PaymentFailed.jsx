//payment failed page
import { Button, Container } from "react-bootstrap";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import { motion } from "framer-motion";
import "./payment.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentFailed = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <UserHeader />
            <section className='payment-success-section'>
                <Container className='text-center success-content'>
                    <motion.img
                        src='/images/Info.webp'
                        alt='Payment failed'
                        className='success-icon mb-3'
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            duration: 1.2,
                        }}
                    />
                    <motion.h2
                        className='payment-title'
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}>
                        Oops Payment Failed !
                    </motion.h2>

                    <motion.div
                        className='mt-4 d-flex justify-content-center gap-3'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}>
                        <Button
                            variant='outline-dark'
                            className='px-4 py-2'
                            onClick={() =>
                                navigate("/orders", { replace: true })
                            }>
                            VIEW ORDERS
                        </Button>
                        <Button
                            variant='outline-dark'
                            className='px-4 py-2'
                            onClick={() =>
                                navigate("/cart", { replace: true })
                            }>
                            Try Again
                        </Button>
                    </motion.div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default PaymentFailed;
