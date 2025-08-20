const notFound = (req, res)=>{
    res.status(404).json({message: 'page not found'});
}

export default notFound;