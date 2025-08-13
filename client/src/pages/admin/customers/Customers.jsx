import { useEffect } from 'react';
import { Table, Button, Image, Form } from 'react-bootstrap';
import { FaTrash, FaCheckCircle, FaBan, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../../components/SideNav/AdminSidebar';
import AdminFooter from '../../../components/Footer/AdminFooter';
import { getAllUsers } from '../../../features/users/userSlice';
import { deleteUsers } from '../../../features/users/userSlice';
import './customerPage.css';
import LoadingSpinner from '../../../components/LoadingSpinner';

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
                                {users.map(({_id, name, email, orders = 0, amount = 0, status = 'Active', avatar}) => (
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
                                                variant={status === 'Active' ? 'outline-success' : 'outline-danger'}
                                                style={{ width: 80 }}
                                                disabled
                                            >
                                                {status}
                                            </Button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(_id)} style={{ border: 'none', background: 'transparent' }}>
                                                <FaTrash style={{ cursor: 'pointer' }} color="#222" />
                                            </button>
                                        </td>
                                        <td>
                                            {status === 'Active' ? (
                                                <FaBan style={{ cursor: 'pointer' }} color="red" />
                                            ) : (
                                                <FaCheckCircle style={{ cursor: 'pointer' }} color="green" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <AdminFooter />
            </div>
        </div>
        </>
    );
};

export default CustomersPage;
