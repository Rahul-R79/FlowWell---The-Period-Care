// user AboutUs
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import "./aboutus.css";

const AboutUs = () => {
    return (
        <>
            <UserHeader />
            <section className='aboutus container my-5'>
                <div className='row justify-content-center'>
                    <div className='col-12 col-lg-9'>
                        <div className='p-4 shadow rounded bg-white'>
                            <h2 className='text-center mb-4'>About FlowWell</h2>

                            <p>
                                About Flow Well, we believe that menstruation
                                should never be a source of shame, discomfort,
                                or inconvenience. Our mission is to empower
                                individuals who menstruate by providing
                                high-quality, sustainable, and thoughtfully
                                designed menstrual care products that support
                                both health and confidence—every cycle, every
                                day.
                            </p>

                            <p>
                                Flow Well was founded with a clear purpose: to
                                normalize conversations around periods and offer
                                reliable, eco-conscious alternatives that meet
                                the real needs of real people. We understand
                                that period care is personal, and thats why
                                every product in our store is curated with
                                safety, comfort, and dignity in mind.
                            </p>

                            <p>
                                We are committed to breaking taboos, challenging
                                outdated stigma, and advocating for period
                                equity. Whether you are exploring reusable
                                options, looking for a more comfortable fit, or
                                simply want reliable products delivered
                                discreetly to your door, Flow Well is here to
                                support your flow with compassion and
                                convenience.
                            </p>

                            <p>
                                Our brand stands on the values of transparency,
                                inclusivity, and sustainability. We partner with
                                ethical suppliers, prioritize biodegradable or
                                recyclable materials whenever possible, and
                                constantly seek to improve the impact of our
                                products on both people and the planet.
                            </p>

                            <p>
                                At Flow Well, were more than a store—were a
                                community. We celebrate bodies of all types,
                                support menstrual education, and create space
                                for open conversations around cycles, wellness,
                                and self-care. Thank you for choosing Flow Well.
                                Lets make periods better—together.
                            </p>

                            <p>
                                Developed and Co-founded by{" "}
                                <a
                                    href='https://www.linkedin.com/in/rahulqwe/'
                                    target='_blank'
                                    rel='noopener noreferrer'>
                                    Rahul
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default AboutUs;
