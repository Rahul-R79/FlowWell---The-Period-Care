//user addresses
import { Link, useParams } from "react-router-dom";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteAddress, getAllAddresses } from "../../../features/addressSlice";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { confirmAlert } from "../../../utils/confirmAlert";

function Address() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { addresses, loadingByAction } = useSelector(
        (state) => state.address
    );

    useEffect(() => {
        dispatch(getAllAddresses());
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteAddress(id)).unwrap();
        } catch (err) {
        }
    };

    const handleDeleteClick = async (id) => {
        const confirmed = await confirmAlert(
            "Delete Address?",
            "Are you sure you want to delete the address",
            "Delete",
            "Cancel"
        );

        if (confirmed) {
            handleDelete(id);
        }
    };

    return (
        <>
            {loadingByAction.getAllAddresses && <LoadingSpinner />}
            <UserHeader />
            <div className='address container mt-5 mb-5'>
                <div className='row'>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mt-4 mb-5'>
                        <div className='p-4 shadow rounded bg-white'>
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h3 className='mb-0 mx-auto'>MANAGE ADDRESS</h3>
                                <Button
                                    variant='primary'
                                    onClick={() => navigate("/address/add")}>
                                    Add new Address
                                </Button>
                            </div>

                            {!loadingByAction.getAllAddresses &&
                                addresses?.length === 0 && (
                                    <p className='text-center mt-5 text-danger'>
                                        No addresses found. Add a new one!
                                    </p>
                                )}

                            {addresses?.map((addr) => (
                                <div
                                    key={addr._id}
                                    className='p-4 mb-4 bg-light rounded d-flex justify-content-between align-items-start w-100'
                                    style={{ minHeight: "100px" }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>{addr.fullName}</strong>
                                        <p className='mb-0'>
                                            {addr.streetAddress}, {addr.state} -{" "}
                                            {addr.pincode}
                                        </p>
                                    </div>
                                    <div className='dropdown'>
                                        <button
                                            className='btn btn-light'
                                            type='button'
                                            data-bs-toggle='dropdown'>
                                            ⋮
                                        </button>
                                        <ul className='dropdown-menu'>
                                            <li>
                                                <Link
                                                    className='dropdown-item'
                                                    to={`/address/${addr._id}/edit`}>
                                                    Edit
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className='dropdown-item text-danger'
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            addr._id
                                                        )
                                                    }>
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Address;
