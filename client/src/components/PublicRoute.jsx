//public routes
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = ()=>{
    const {user} = useSelector(state => state.auth);

    if(user){
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}