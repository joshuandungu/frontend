import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminUsers, updateUserStatus, deleteUser } from '../../api/api';

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const userToken = useMemo(() => userInfo?.token, [userInfo]);

    const loadUsers = useCallback(async () => {
        if (!userToken) return;
        setLoading(true);
        try {
            const { data } = await fetchAdminUsers(userToken);
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Failed to load users. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleUpdateStatus = useCallback(async (userId, status) => {
        if (!userToken) return;
        try {
            await updateUserStatus(userId, { status }, userToken);
            loadUsers(); // Refresh user list
        } catch (err) {
            setError('Failed to update user status.');
            console.error(err);
        }
    }, [userToken, loadUsers]);

    const handleDeleteUser = useCallback(async (userId) => {
        if (!userToken) return;
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(userId, userToken);
                loadUsers(); // Refresh user list
            } catch (err) {
                setError('Failed to delete user.');
                console.error(err);
            }
        }
    }, [userToken, loadUsers]);

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h2 className="my-4">Admin - Manage Users</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`badge bg-${user.status === 'active' ? 'success' : 'secondary'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    {user.status === 'active' ? (
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdateStatus(user._id, 'suspended')} disabled={user.role === 'admin'}>Suspend</button>
                                    ) : (
                                        <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateStatus(user._id, 'active')}>Reactivate</button>
                                    )}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id)} disabled={user.role === 'admin'}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserAdmin;