import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../features/auth/authAdminSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import Sidebar from "../../components/Sidebar/AdminSidebar";

function DashBoard(){
    const {admin, loadingByAction, errorByAction} = useSelector(state => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getAdminLoading = loadingByAction?.adminLogout;

    const handleAdminLogout = async(e)=>{
        e.preventDefault();
        try{
            await dispatch(adminLogout()).unwrap();
            navigate('/adminsignin');
        }catch(err){
            console.log('adminlogout error', err);
        }
    }
    
    return(
        <>
            {getAdminLoading && <LoadingSpinner/>}
            <Sidebar/>
            {/* <button onClick={handleAdminLogout} disabled={getAdminLoading}>Logout</button> */}
        </>
    )
}

export default DashBoard;