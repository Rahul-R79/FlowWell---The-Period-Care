import Review from "../../models/Review.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

//add reviews
export const addReview = async (req, res) => {
    const { rating, heading, description, productId, orderId, userId } =
        req.body;

    try {
        const existingReview = await Review.findOne({
            product: productId,
            order: orderId,
            user: userId,
        });

        if (existingReview) {
            return res.status(400).json({
                errors: [
                    {
                        field: "general",
                        message: "You have already reviewed this product",
                    },
                ],
            });
        }

        const review = await Review.create({
            rating,
            heading,
            description,
            product: productId,
            order: orderId,
            user: userId,
        });

        res.status(201).json({ review });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get product reviews
export const getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ product: productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ reviews });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get all reviews in home page
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ reviews });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//create a review summary
export const getReviewSummary = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ product: productId })
            .sort({ createdAt: -1 })
            .limit(5);

        if (reviews.length === 0) {
            return res.json({ summary: "No reviews available yet." });
        }

        const reviewText = reviews
            .map((review) => `${review.heading}: ${review.description}`)
            .join("\n");

        const response = await fetch(
            "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: reviewText }),
            }
        );

        const result = await response.json();

        const summary =
            result[0]?.summary_text || "Could not generate summary.";
        res.json({ summary });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
