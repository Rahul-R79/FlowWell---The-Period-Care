import Sidebar from "../../components/SideNav/AdminSidebar";
import AdminFooter from "../../components/Footer/AdminFooter";
import Customers from "./customers/Customers";


export default function DashBoard() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main className="flex-grow-1 p-3 d-flex justify-content-center align-items-center">
                    <div className="d-flex flex-column align-items-center">
                        <h1>Dashboard Content</h1>
                        <p>Work on progres......</p>
                    </div>
                </main>
            </div>
            <AdminFooter />
        </div>
    );
}
