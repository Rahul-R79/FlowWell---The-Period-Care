// home page user reviews
import { Container, Card } from "react-bootstrap";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { getAllReviews } from "../../features/reviewSlice";
import "./reviews.css";

export default function ReviewsTab() {
    const dispatch = useDispatch();
    const { review } = useSelector((state) => state.review);

    const scrollRef = useRef(null);

    useEffect(() => {
        dispatch(getAllReviews());
    }, [dispatch]);

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        let scrollPos = 0;
        const speed = 1;
        let animationFrameId;

        const scroll = () => {
            if (slider.scrollWidth > slider.clientWidth) {
                scrollPos += speed;
                if (scrollPos >= slider.scrollWidth - slider.clientWidth) {
                    scrollPos = 0;
                }
                slider.scrollLeft = scrollPos;
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [review]);

    return (
        <section className='container review-tab py-4'>
            <Container>
                <h4 className='fw-bold mb-4'>OUR HAPPY CUSTOMERS</h4>

                <div className='review-slider-wrapper' ref={scrollRef}>
                    <div className='review-slider'>
                        {review.map((rev, index) => (
                            <div className='review-slide' key={index}>
                                <Card className='p-3 h-100 shadow-sm text-center review-card'>
                                    <Card.Body>
                                        <h5 className='fw-bold mb-3'>
                                            {rev.heading}
                                        </h5>
                                        <p className='text-muted mb-4'>
                                            {rev.description}
                                        </p>

                                        {/* Stars */}
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                color={
                                                    i < rev.rating
                                                        ? "#fbbf24"
                                                        : "#e5e7eb"
                                                }
                                                size={18}
                                                className='me-1'
                                            />
                                        ))}

                                        <p className='fw-semibold mb-0 mt-3'>
                                            {rev.user.name}
                                            <FaCheckCircle
                                                color='green'
                                                size={15}
                                                className='mb-2 mx-2'
                                            />
                                        </p>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
