import Product from "../../models/Product.js";
import cloudinary from "../../utils/cloudinary.js";

export const addProduct = async(req, res)=>{
    const {
        name, 
        description, 
        basePrice, 
        discountPrice, 
        category,
        sizes, 
    } = req.body;

    try{
        const existingProduct = await Product.findOne({name});

        if(existingProduct) {
            return res.status(400).json({errors: [{field: 'general', message: 'Product already exist'}]});
        }

        const imageUrls = await Promise.all(
            req.files.map((file)=>{
                return new Promise((resolve, reject)=>{
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {folder: 'products'},
                        (error, result)=>{
                            if(error) reject(error);
                            else resolve(result.secure_url);
                        }
                    )
                    uploadStream.end(file.buffer);
                })
            })
        )

        const product = await Product.create({
            name,
            description, 
            images: imageUrls,
            basePrice, 
            discountPrice, 
            category,
            sizes 
        });

        res.status(201).json({product});
    }catch(err){                        
        return res.status(500).json({message: 'internal server error'});
    }
}