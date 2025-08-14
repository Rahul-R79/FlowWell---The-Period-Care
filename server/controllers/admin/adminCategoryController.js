import Category from "../../models/Category.js";

export const addCategory = async(req, res)=>{
    const {name, description} = req.body;

    try{
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({errors: [{field: 'general', message: 'Category already exists'}]});
        }

        const category = await Category.create({
            name, 
            description
        });

        res.status(201).json(category);
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}

export const getCategory = async(req, res)=>{
    try{
        let {page = 1, limit = 8, search = ''} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search ? {name: {$regex: search, $options: 'i'}} : {};

        const totalCategory = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalCategory / limit);

        const category = await Category.find(query)
        .skip((page  - 1) * limit)
        .limit(limit)
        .sort({createdAt: -1})
        res.status(200).json({category, currentPage: page, totalPages, totalCategory});
    }catch(err){
        res.status(500).json({message: 'internal server error'});
    }
}