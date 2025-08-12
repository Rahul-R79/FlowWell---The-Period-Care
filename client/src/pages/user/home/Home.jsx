import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ReviewsTab from "../../../components/Reviews/ReviewsTab";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import './home.css'
import { useSelector } from "react-redux";

function Home(){
	const {user} = useSelector(state => state.auth);
    return(
        <>
            <UserHeader/>
            {/* hero section */}
			<section className="container hero-section">
				<Container className="py-5">
				<Row className="align-items-center justify-content-between">
					{/* Text Section */}
					<Col md={12} lg={5} className="mb-4 mb-md-0">
					<h1 className="fw-bold w-sm-25">Curated Care for Every Flow</h1>
					<p>
						We empower every individual to embrace their cycle with confidence,
						convenience, and care.
					</p>
					<Button variant="dark" className="mb-4">
						Shop Now
					</Button>
					<Row>
						<Col xs={4}>
							<h5>30+</h5>
							<p>International Brands</p>
						</Col>
						<Col xs={4}>
							<h5>100+</h5>
							<p>High-Quality Products</p>
						</Col>
						<Col xs={4}>
							<h5>10,000+</h5>
							<p>Happy Customers</p>
						</Col>
					</Row>
					</Col>
					{/* Image Section */}
					<Col md={12} lg={7} className="text-center">
						{user? (
							<img
							src="/images/hero/hero_img2.webp"
							alt="Hero"
							className="img-fluid hero-img-main"
							/>
						): (
							<img
							src="/images/hero/hero_img.webp"
							alt="Hero"
							className="img-fluid hero-img-main"
							/>
						)}
					</Col>
				</Row>
				</Container>
			</section>
            
            {/* banner */}
            <Container fluid className="text-center mb-4">
                <img src="/images/banners/sales_banners.webp" alt="Sale Banner" className="img-fluid" />
            </Container>

			{/* gifthampers */}
			<div className="gift-hampers-section mb-5 container">
				<Container className="gift-hampers-container w-75 mt-5 mb-5">
					<h2 className="gift-hampers-heading">CUSTOMISED GIFT HAMPER</h2>

					<Row className="g-4 mb-3">
						{/* Card 1 */}
						<Col xs={12} lg={5}>
							<div className="gift-card">
								<Image
									src="/images/products/giftHampers/gift-hamper-02.webp"
									alt="Gift Hamper 1"
									fluid
									className="gift-image me-sm-3 mb-3 mb-sm-0"
								/>
								<h5 className="gift-text">GIFT HAMPERS</h5>
							</div>
						</Col>

						{/* Card 2 */}
						<Col xs={12} lg={7}>
							<div className="gift-card flex-sm-row-reverse">
								<Image
									src="/images/products/giftHampers/gift-hamper-01.webp"
									alt="Gift Hamper 2"
									fluid
									className="gift-image ms-sm-3 mb-3 mb-sm-0"
								/>
								<h5 className="gift-text">FOR YOUR</h5>
							</div>
						</Col>

						{/* Card 3 */}
						<Col xs={12} lg={7}>
							<div className="gift-card">
								<Image
									src="/images/products/giftHampers/gift-hamper-04.webp"
									alt="Gift Hamper 3"
									fluid
									className="gift-image me-sm-3 mb-3 mb-sm-0"
								/>
								<h5 className="gift-text">FAVOURITE</h5>
							</div>
						</Col>

						{/* Card 4 */}
						<Col xs={12} lg={5}>
							<div className="gift-card flex-sm-row-reverse">
								<Image
									src="/images/products/giftHampers/gift-hamper-03.webp"
									alt="Gift Hamper 4"
									fluid
									className="gift-image ms-sm-3 mb-3 mb-sm-0"
								/>
								<h5 className="gift-text">PERSON</h5>
							</div>
						</Col>
					</Row>
				</Container>
			</div>

			{/* reviews Tab */}
			<ReviewsTab/>
            <Footer/>
        </>
    )
}

export default Home;