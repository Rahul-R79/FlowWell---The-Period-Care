import { useEffect } from 'react';
import { Table, Button, Image, Form } from 'react-bootstrap';
import { FaTrash, FaCheckCircle, FaBan, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../../components/SideNav/AdminSidebar';
import AdminFooter from '../../../components/Footer/AdminFooter';
import { deleteUsers, unblockUser, blockUser, getAllUsers } from '../../../features/users/userSlice';
import './customerPage.css';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { confirmAlert } from '../../../utils/confirmAlert';
import PaginationButton from '../../../components/Pagination';

const CustomersPage = () => {
    const dispatch = useDispatch();
    const { users, loadingByAction } = useSelector(state => state.users);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleDelete = async(userId)=>{
        try{
            await dispatch(deleteUsers(userId)).unwrap();
        }catch(err){
            console.log('user deletion error', err);
        }
    }

    const handleDeleteClick = async(userId)=>{
        const confirmed = await confirmAlert(
            'Delete User?',
            'Are you sure you want to delete this user?',
            'Delete',
            'Cancel'
        );

        if(confirmed){
            handleDelete(userId);
        }
    }

    const handleBlockToggle = async(userId, isBlocked)=>{
        try{
            if(isBlocked){
                await dispatch(unblockUser(userId)).unwrap();
            }else{
                await dispatch(blockUser(userId)).unwrap();
            }
        }catch(err){
            console.log('user blocking error', err);
        }
    }

    const handleBlockToggleClick = async(userId, isBlocked)=>{
        const confirmed = await confirmAlert(
            isBlocked ? 'Unblock User?' : 'Block User?',
            isBlocked ? 'Are you sure you want to unblock this user?' : 'Are you sure you want to block this user?',
            isBlocked ? 'Unblock' : 'Block',
            'Cancel'
        )
        if(confirmed){
            handleBlockToggle(userId, isBlocked);
        }
    }

    return (
        <>
        {loadingByAction.getAllUsers && <LoadingSpinner/>}
        <div className="d-flex flex-column flex-lg-row min-vh-100">
            <Sidebar />
            {/* Main content */}
            <div className="flex-grow-1 d-flex flex-column main-content">
                <div className="flex-grow-1 py-4 d-flex flex-column container">
                    <h4 className="mb-4 text-center text-lg-start">Customers</h4>

                    {/* Search Input */}
                    <Form.Group className="mb-3 search-customer" controlId="searchCustomer">
                        <div className="search-wrapper">
                            <Form.Control
                                type="text"
                                placeholder="Search customers"
                                className="search-input"
                            />
                            <FaSearch className="search-icon" />
                        </div>
                    </Form.Group>

                    {/* Scrollable table container */}
                    <div className="table-responsive bg-white rounded-2 shadow-sm flex-grow-1">
                        <Table bordered hover className="mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Orders</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Delete</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(({_id, name, email, orders = 0, amount = 0, isBlocked=false, status = 'Active', avatar}) => (
                                    <tr key={_id}>
                                        <td className="d-flex align-items-center">
                                            <Image
                                                src={avatar || 'images/hero/default-avatar.webp'}
                                                roundedCircle
                                                width={36}
                                                height={36}
                                                alt={name}
                                                className="me-2"
                                            />
                                            <span>{name}</span>
                                        </td>
                                        <td>{email}</td>
                                        <td>{orders}</td>
                                        <td>{amount}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant={isBlocked ? 'outline-danger' : 'outline-success'}
                                                style={{ width: 80 }}
                                                disabled
                                            >
                                                {isBlocked ? 'Blocked' : 'Active'}
                                            </Button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDeleteClick(_id)} style={{ border: 'none', background: 'transparent' }}>
                                                <FaTrash style={{ cursor: 'pointer' }} color="#222" />
                                            </button>
                                        </td>
                                        <td>
                                            <button style={{ cursor: 'pointer', border: 'none', background: 'transparent'}}
                                                onClick={() => handleBlockToggleClick(_id, isBlocked)}
                                            >
                                                {!isBlocked ? (
                                                    <FaBan color="red" />
                                                ) : (
                                                    <FaCheckCircle color="green" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <PaginationButton/>
                <AdminFooter />
            </div>
        </div>
        </>
    );
};

export default CustomersPage;
