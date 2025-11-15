import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminStats } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const userToken = useMemo(() => userInfo?.token, [userInfo]);

    const loadDashboardData = useCallback(async () => {
        if (!userToken) return;
        setLoading(true);
        try {
            const statsRes = await fetchAdminStats(userToken);
            setStats(statsRes.data);
            setError('');
        } catch (err) {
            setError('Failed to load dashboard data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    if (loading) return <div>Loading Admin Dashboard...</div>;

    return (
        <div>
            <h2 className="my-4">Admin Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Quick Stats Section */}
            <h3 className="mb-3">Quick Stats</h3>
            {stats && (
                <div className="row">
                    {/* Users Card */}
                    <div className="col-md-6 col-lg-3 mb-4">
                        <Link to="/admin/users" className="text-decoration-none">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h5 className="card-title"><i className="bi bi-people-fill me-2"></i>Users</h5>
                                    <p className="fs-2 fw-bold">{stats.users.total}</p>
                                    <div className="d-flex justify-content-around">
                                        <small>Active: {stats.users.active}</small>
                                        <small>Suspended: {stats.users.suspended}</small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Blogs Card */}
                    <div className="col-md-6 col-lg-3 mb-4">
                        <Link to="/admin/blogs" className="text-decoration-none">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h5 className="card-title"><i className="bi bi-file-earmark-text-fill me-2"></i>Blogs</h5>
                                    <p className="fs-2 fw-bold">{stats.blogs.total}</p>
                                    <div className="d-flex justify-content-around">
                                        <small>Approved: {stats.blogs.approved}</small>
                                        <small>Pending: {stats.blogs.pending}</small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Events Card */}
                    <div className="col-md-6 col-lg-3 mb-4">
                        <Link to="/admin/events" className="text-decoration-none">
                            <div className="card h-100 text-center">
                                <div className="card-body"><h5 className="card-title"><i className="bi bi-calendar-event-fill me-2"></i>Events</h5><p className="fs-2 fw-bold">{stats.events}</p></div>
                            </div>
                        </Link>
                    </div>

                    {/* Gallery Card */}
                    <div className="col-md-6 col-lg-3 mb-4">
                        <Link to="/admin/gallery" className="text-decoration-none">
                            <div className="card h-100 text-center">
                                <div className="card-body"><h5 className="card-title"><i className="bi bi-images me-2"></i>Gallery Items</h5><p className="fs-2 fw-bold">{stats.galleryItems}</p></div>
                            </div>
                        </Link>
                    </div>

                    {/* Contacts Card */}
                    <div className="col-md-6 col-lg-3 mb-4">
                        <Link to="/admin/contacts" className="text-decoration-none">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h5 className="card-title"><i className="bi bi-person-rolodex me-2"></i>Officials & Executives</h5>
                                    <p className="fs-2 fw-bold">{stats.contacts.total}</p>
                                    <div className="d-flex justify-content-around">
                                        <small>Officials: {stats.contacts.officials}</small>
                                        <small>Executives: {stats.contacts.executives}</small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;