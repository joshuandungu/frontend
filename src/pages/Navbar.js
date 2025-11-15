import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationAsRead } from '../api/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [notifications, setNotifications] = useState([]);
    const { theme, changeTheme } = useTheme();
    const { userInfo, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load notifications if the user is logged in
        if (userInfo) {
            loadNotifications(userInfo.token);
        }
    }, [userInfo]); // Re-run when userInfo changes

    const loadNotifications = async (token) => {
        try {
            const { data } = await fetchNotifications(token);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(notification._id, userInfo.token);
                loadNotifications(userInfo.token); // Refresh notifications
            }
            navigate(notification.link);
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">BITSA</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/blog">Blog</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/events">Events</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/gallery">Gallery</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        {isAdmin && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Admin
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/users">Manage Users</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/blogs">Manage Blogs</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/events">Manage Events</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/contacts">Manage Contacts</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/gallery">Manage Gallery</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/carousel">Manage Carousel</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/categories">Manage Categories</Link></li>

                                </ul>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {userInfo ? (
                            <>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className={`bi ${theme === 'light' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i> Theme
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><button className="dropdown-item" onClick={() => changeTheme('light')}>
                                            <i className="bi bi-sun-fill me-2"></i> Light
                                        </button></li>
                                        <li><button className="dropdown-item" onClick={() => changeTheme('dark')}>
                                            <i className="bi bi-moon-stars-fill me-2"></i> Dark
                                        </button></li>
                                        <li><button className="dropdown-item" onClick={() => changeTheme('auto')}>
                                            <i className="bi bi-circle-half me-2"></i> Auto
                                        </button></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bi bi-bell-fill position-relative">
                                            {unreadCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {unreadCount}
                                                    <span className="visually-hidden">unread messages</span>
                                                </span>
                                            )}
                                        </i>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <li key={notif._id}>
                                                    <a className={`dropdown-item ${!notif.isRead ? 'fw-bold' : ''}`} href="#" onClick={() => handleNotificationClick(notif)}>
                                                        {notif.message}
                                                    </a>
                                                </li>
                                            ))
                                        ) : (
                                            <li><a className="dropdown-item disabled" href="#">No new notifications</a></li>
                                        )}
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Welcome, {userInfo.user.name}</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Admin
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><Link className="dropdown-item" to="/admin/login">Admin Login</Link></li>
                                        <li><Link className="dropdown-item" to="/admin/register">Admin Register</Link></li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;