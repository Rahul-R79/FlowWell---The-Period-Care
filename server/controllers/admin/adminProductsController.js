import Product from "../../models/Product.js";

export const addProduct = async(req, res)=>{
    const {
        name, 
        description, 
        images, 
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

        const product = await Product.create({
            name,
            description, 
            images, 
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