//wishlist schema
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        selectedSize: {type: String}
    }]
}, {timestamps: true});

export default mongoose.model('Wishlist', wishlistSchema);