import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { clearErrors } from "../features/auth/authUserSlice";

function ClearErrorOnRouteChange(){
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(clearErrors());
    }, [location.pathname, dispatch]);

    return null;
}

export default ClearErrorOnRouteChange;