import Product from "../../models/Product.js";
import cloudinary from "../../utils/cloudinary.js";

export const addProduct = async (req, res) => {
    const {
        name, 
        description, 
        basePrice, 
        discountPrice, 
        category,
        sizes,
        offer
    } = req.body;

    try {
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(400).json({ errors: [{ field: 'general', message: 'Product already exists' }] });
        }

        const imageUrls = await Promise.all(
            req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'products' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
            })
        );

        const product = await Product.create({
            name,
            description,
            images: imageUrls,
            basePrice,
            discountPrice,
            category,
            sizes,
            offer
        });

        res.status(201).json({ product });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const getProduct = async(req, res)=>{
    try{
        let {page = 1, limit = 10, search = ''} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search ? {name: {$regex: search, $options: 'i'}} : {};

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(query).populate("category", "name")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt: -1})

        res.status(200).json({products, currentPage: page, totalPages, totalProducts});
    }catch(err){        
        return res.status(500).json({message: 'internal server error'});
    }
}

export const productStatus = async(req, res)=>{
    const {id} = req.params;

    try{
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message: 'product not found'});
        }

        const toggleStatus = !product.isActive;

        const updateProduct = await Product.findByIdAndUpdate(id, {$set: {isActive: toggleStatus}}, {new: true});

        res.status(200).json({message: 'status updated', product: updateProduct});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}