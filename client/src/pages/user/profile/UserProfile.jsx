import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../../../features/auth/authSlice"
import { useNavigate } from "react-router-dom";

function UserProfile(){
    const {user, loading} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async(e)=>{
        e.preventDefault();
        try{
            await dispatch(logoutUser());
            navigate('/');
        }catch(err){
            console.log('logout error', err);  
        }
    }
    return(
        <>
        <h1>User Profile Page</h1>
        <button onClick={handleLogout} disabled={loading}>Logout</button>
        </>
    )
}

export default UserProfile