import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { Table, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllReferrals } from "../../../features/referral/adminReferralSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AdminReferAndEarn = () => {
    const dispatch = useDispatch();
    const { referrals, loadingByAction } = useSelector(
        (state) => state.adminReferral
    );

    useEffect(() => {
        dispatch(getAllReferrals());
    }, [dispatch]);

    const totalReferrals = referrals.length;
    const totalReferredUsers = referrals.reduce(
        (acc, curr) => acc + (curr.usages?.length || 0),
        0
    );

    return (
        <>
        {loadingByAction.getAllReferrals && <LoadingSpinner/>}
        <div className='d-flex flex-column flex-lg-row min-vh-100'>
            <Sidebar />
            <div className='flex-grow-1 d-flex flex-column main-content mt-5'>
                <div className='flex-grow-1 py-4 d-flex flex-column container referAndEarn-container'>
                    <h4 className='mb-4 text-center text-lg-start'>
                        Refer And Earn
                    </h4>

                    {/* summary boxes */}
                    <div className='d-flex gap-3 mb-4 flex-wrap'>
                        <div className='p-3 bg-light rounded shadow-sm flex-fill text-center'>
                            <h6 className='mb-2'>Total Referrals:</h6>
                            <h5 className='fw-bold'>{totalReferrals}</h5>
                        </div>
                        <div className='p-3 bg-light rounded shadow-sm flex-fill text-center'>
                            <h6 className='mb-2'>Referred Users:</h6>
                            <h5 className='fw-bold'>{totalReferredUsers}</h5>
                        </div>
                    </div>

                    {/* table */}
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Referrer Name</th>
                                <th>Referral Code</th>
                                <th>Referred Users</th>
                                <th>Reward Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map((ref) => (
                                <tr key={ref._id}>
                                    <td>{ref.generatedUser?.name}</td>
                                    <td className="text-primary">{ref.couponCode}</td>
                                    <td>{ref.usages?.length || 0}</td>
                                    <td>
                                        {ref.isClaimed ? (
                                            <p className="text-success fw-semibold">Claimed</p>
                                        ) : (
                                            <p className="text-danger fw-semibold">Pending</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <AdminFooter />
            </div>
        </div>
        </>
    );
};

export default AdminReferAndEarn;
