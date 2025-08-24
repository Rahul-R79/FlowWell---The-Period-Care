import Address from "../../models/Address.js";

export const addAddress = async(req, res)=>{
    const {
        fullName,
        phone,
        pincode,
        locality,
        streetAddress,
        city,
        state,
        landmark,
        alternatePhone,
        type,
    } = req.body;

    try{
        const addressCount = await Address.countDocuments({user: req.user.id});
        if(addressCount>=3){
            return res.status(400).json({errors: [{field: 'general', message: 'You can only add up to 3 addresses'}]});
        }
        const address = await Address.create({
            fullName,
            phone,
            pincode,
            locality,
            streetAddress,
            city,
            state,
            landmark,
            alternatePhone,
            type,
            user: req.user.id
        })        

        res.status(201).json({message: 'address created successfully', address});
    }catch(err){        
        res.status(500).json({message: 'internal server error'});
    }
}

export const getAllAddresses = async(req, res)=>{
    try{
        const addresses = await Address.find({user: req.user.id}).sort({createdAt: -1});
        return res.status(200).json({addresses});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}


export const getSingleAddress = async(req, res)=>{
    const {id} = req.params;

    try{
        const address = await Address.findById(id);

        if(!address){
            return res.status(404).json({message: 'Address not found'});
        }

        res.status(200).json({address});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}

export const editAddress = async(req, res)=>{
    const {id} = req.params;
    const {
        fullName,
        phone,
        pincode,
        locality,
        streetAddress,
        city,
        state,
        landmark,
        alternatePhone,
        type,
    } = req.body;

    try{
        const address = await Address.findById(id);
        
        if(!address){
            return res.status(404).json({message: 'address not found'});
        }

        address.fullName = fullName;
        address.phone = phone;
        address.pincode = pincode;
        address.locality = locality;
        address.streetAddress = streetAddress;
        address.city = city;
        address.state = state;
        address.landmark = landmark;
        address.alternatePhone = alternatePhone;
        address.type = type

        await address.save();
        res.status(200).json({address});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}

export const deleteAddress = async(req, res)=>{
    const {id} = req.params;

    try{
        const address = await Address.findById(id);

        if(!address){
            return res.status(404).json({message: 'address not found'});
        }

        await address.deleteOne();

        return res.status(200).json({message: 'address deleted successfully', address});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}