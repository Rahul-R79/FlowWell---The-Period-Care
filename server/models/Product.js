import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],
        required: true
    },
    basePrice: { 
        type: Number, 
        required: true 
    }, 
    discountPrice: { 
        type: Number 
    },
    sizes: [
        {
            size: {type: String, required: true},
            stock: {type: Number, required: true}
        }
    ],
    isActive: { 
        type: Boolean, 
        default: true 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {timestamps: true});

export default mongoose.model('Product', productSchema);