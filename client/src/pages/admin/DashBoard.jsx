import { useDispatch, useSelector } from "react-redux";
import { getCurrentAdmin } from "../../features/auth/authSlice";
import { useEffect } from "react";

function DashBoard(){
    const dispatch = useDispatch();
    const {user, loadingByAction, errorByAction} = useSelector(state => state.auth);

    useEffect(()=>{
        dispatch(getCurrentAdmin());
    }, [dispatch]);
    
    return(
        <h1>dashboard</h1>
    )
}

export default DashBoard;