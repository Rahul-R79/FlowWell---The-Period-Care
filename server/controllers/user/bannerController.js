import Banner from "../../models/Banner.js"

export const getUserBanner = async(req, res)=>{
    try{
        const banner = await Banner.find({
            isActive: true
        });
        
        if(!banner){
            return res.status(404).json({message: 'banner not found'});
        }

        res.status(200).json({banner});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}