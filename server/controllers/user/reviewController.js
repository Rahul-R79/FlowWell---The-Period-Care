import Review from "../../models/Review.js";

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
            return res
                .status(400)
                .json({
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
            user: userId
        })

        res.status(201).json({ review });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

export const getReviewsByProduct = async(req, res)=>{
    const {productId} = req.params;

    try{
        const reviews = await Review.find({product: productId})
        .populate('user', 'name')
        .sort({createdAt: -1})

        return res.status(200).json({reviews});
    }catch(err){
        console.log(err);
        
        return res.status(500).json({message: 'internal server error'});
    }
}

export const getAllReviews = async(req, res)=>{
    try{
        const reviews = await Review.find()
        .populate('user', 'name')
        .sort({createdAt: -1})

        res.status(200).json({reviews});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}