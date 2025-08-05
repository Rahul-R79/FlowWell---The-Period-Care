import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import SignIn from "./pages/user/auth/SignIn";
import SignUpOtp from "./pages/user/auth/SignUpOtp";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signupOtp" element={<SignUpOtp/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;