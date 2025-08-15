import Category from "../../models/Category.js";

export const getCategory = async(req, res)=>{
    try{
        let {page = 1, limit = 10, search = ''} = req.query;
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

        res.status(201).json({category});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}

export const getSingleCategory = async(req, res)=>{

    try{
        const {id} = req.params;
        const category = await Category.findById(id);

        if(!category){
            return res.status(404).json({message: 'Category not found'});
        }

        res.status(200).json({category});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}

export const editCategory = async(req, res)=>{
    const {id} = req.params;
    const {name, description} = req.body;

    try{
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({message: 'category not found'});
        }
        const existingCategory = await Category.findOne({name, _id: {$ne: id}});

        if(existingCategory){
            return res.status(400).json({errors: [{field: 'general', message: 'Category name already exists'}]});
        }

        category.name = name;
        category.description = description;

        await category.save();

        res.status(200).json({category});
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: 'internal server error'});
    }
}

export const categoryStatus = async(req, res)=>{
    const {id} = req.params;

    try{
        const category = await Category.findById(id);

        if(!category){
            return res.status(404).json({message: 'category not found'});
        }

        const toggleStatus = category.status === 'active' ? 'inactive' : 'active';

        const updateCategory = await Category.findByIdAndUpdate(id, {$set: {status: toggleStatus}}, {new: true});

        res.status(200).json({message: 'status updated', category: updateCategory});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}