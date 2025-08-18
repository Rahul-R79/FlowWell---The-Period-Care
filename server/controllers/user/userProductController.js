import Product from "../../models/Product.js";
import Category from "../../models/Category.js";

export const getAllProducts = async(req, res)=>{
    try{
        let {page = 1, limit = 9, sortBy, size, price, categoryName, offer} = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let filter = {};

        //size filter
        if(size){
            const sizes = size.split(',')
            filter["sizes.size"] = {$in: sizes};
        }

        // price filter
        if(price){
            switch(price){
                case 'under500':
                    filter.basePrice = {$lt: 500};
                    break
                case "500to1000":
                    filter.basePrice = { $gte: 500, $lte: 1000 };
                    break;
                case "1000to2500":
                    filter.basePrice = { $gte: 1000, $lte: 2500 };
                    break;
                case "above2500":
                    filter.basePrice = { $gt: 2500 };
                    break;
            }
        }

        //offer filter 
        if(offer){
            const offers = offer.split(',');
            filter.offer = {$in: offers};
        }

        //category 
        if(categoryName){
            const category = await Category.findOne({name: categoryName.trim()});

            if(category){
                filter.category = category._id;
            }else{
                return res.status(200).json({products: []});
            }
        }

        //sortBy 
        let sortOption = {};
        if(sortBy){
            switch (sortBy){
                case 'priceLowToHigh': sortOption.basePrice = 1;
                break;
                case 'priceHighToLow': sortOption.basePrice = -1;
                break;
                case "aToZ": sortOption.name = 1; 
                break;
                case "zToA": sortOption.name = -1; 
                break;
                case "newArrivals": sortOption.createdAt = -1; 
                break;
            }
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);


        const products = await Product.find(filter)
        .populate('category')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .lean();

        const modifiedProducts = products.map((product)=>{
            let finalPrice = product.basePrice;


            if(product.discountPrice && product.discountPrice > 0){
                finalPrice = product.basePrice - product.discountPrice;
            }

            if(product.offer === 'FLAT'){
                finalPrice = product.basePrice * 0.5
            }

            return { 
                ...product,
                basePrice: product.basePrice,
                finalPrice
            }
        })

        return res.status(200).json({products: modifiedProducts, currentPage: page, totalPages, totalProducts});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}