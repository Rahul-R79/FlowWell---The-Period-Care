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