import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function UserLayout(){
    const {user} = useSelector(state => state.auth);
    if(!user || user.role !== 'user'){
        return <Navigate to="/signup"/>
    }
    return <Outlet/>
}

export function AdminLayout(){
    const {admin} = useSelector(state => state.auth);
    if(!admin || admin.role !== 'admin'){
        return <Navigate to="/adminsignin"/>
    }
    return <Outlet/>
}