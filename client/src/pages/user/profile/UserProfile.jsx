import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../../../features/auth/authUserSlice"
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

function UserProfile(){
    const {user, loadingByAction} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggingOut = loadingByAction?.logoutUser;

    const handleLogout = async(e)=>{
        e.preventDefault();
        try{
            await dispatch(logoutUser()).unwrap();
            navigate('/');
        }catch(err){
            console.log('logout error', err);  
        }
    }
    return(
        <>
        {isLoggingOut && <LoadingSpinner/>}
        <div>
            <h1>User Profile Page</h1>
        </div>
        <button onClick={handleLogout} disabled={isLoggingOut}>Logout</button>
        </>
    )
}

export default UserProfile;