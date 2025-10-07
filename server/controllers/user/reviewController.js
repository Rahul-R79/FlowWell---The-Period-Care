//userReviewController
import Review from "../../models/Review.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

/**
 * @function addReview
 * @description Adds a new review for a product if the user hasn't already reviewed it.
 * @expectedInput req.body: { rating, heading, description, productId, orderId, userId }
 * @expectedOutput { review } or { errors: [{ field, message }] } or { message: "internal server error" }
 */
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

/**
 * @function getReviewsByProduct
 * @description Retrieves all reviews for a specific product.
 * @expectedInput req.params: { productId }
 * @expectedOutput { reviews: [...] } or { message: "internal server error" }
 */
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

/**
 * @function getAllReviews
 * @description Retrieves all reviews across all products (for home page or admin view).
 * @expectedInput none
 * @expectedOutput { reviews: [...] } or { message: "internal server error" }
 */
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

/**
 * @function getReviewSummary
 * @description Generates a summarized text of the latest 5 reviews for a specific product using HuggingFace API.
 * @expectedInput req.params: { productId }
 * @expectedOutput { summary } or { message: "Internal server error" }
 */
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
