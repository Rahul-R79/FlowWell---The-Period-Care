import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./reviews.css";

export default function ReviewsTab() {
	const reviews = [
		{
			title: "Excellent Service",
			text: "Everything arrived on time and in perfect condition. Highly recommended!",
			name: "John Doe",
		},
		{
			title: "Amazing Quality",
			text: "The quality exceeded my expectations. Will definitely buy again!",
			name: "Jane Smith",
		},
		{
			title: "Superb Experience",
			text: "From order to delivery, everything was smooth and professional.",
			name: "Michael Johnson",
		},
		{
			title: "Fantastic Support",
			text: "Customer service was top-notch. Quick response and very helpful.",
			name: "Sarah Lee",
		},
	];

	return (
		<section className="container review-tab">
		<Container>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h4 className="fw-bold mb-0">OUR HAPPY CUSTOMERS</h4>
				<div>
					<Button variant="light" className="p-2 me-2">
						<FaChevronLeft size={10} />
					</Button>
					<Button variant="light" className="p-2">
						<FaChevronRight size={10} />
					</Button>
				</div>
			</div>

			<Row className="gy-4">
			{reviews.map((review, index) => (
				<Col lg={3} md={6} sm={12} key={index}>
					<Card className="p-3 h-100 shadow-sm text-center review-card">
						<Card.Body>
						{/* Title */}
						<h5 className="fw-bold mb-3">{review.title}</h5>

						{/* Review Text */}
						<p className="text-muted mb-4">{review.text}</p>

						{/* Stars */}
						<div className="mb-2">
							{[...Array(5)].map((_, i) => (
							<FaStar key={i} color="#fbbf24" size={18} className="me-1" />
							))}
						</div>

						{/* Verified Icon */}
						<FaCheckCircle color="green" size={20} className="mb-2" />

						{/* Name */}
						<p className="fw-semibold mb-0">{review.name}</p>
						</Card.Body>
					</Card>
				</Col>
			))}
			</Row>
		</Container>
		</section>
	);
}
