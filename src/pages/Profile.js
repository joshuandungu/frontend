import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../api/api';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedInfo);
            loadProfileData(parsedInfo.token);
        } else {
            // If not logged in, redirect to login page
            navigate('/login');
        }
    }, [navigate]);

    const loadProfileData = async (token) => {
        try {
            const { data } = await fetchProfile(token);
            setFormData({
                name: data.name,
                email: data.email,
                course: data.course || ''
            });
        } catch (err) {
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await updateProfile(formData, userInfo.token);
            setSuccess('Profile updated successfully!');

            // Update localStorage with the new user info to keep the app consistent
            const updatedUserInfo = { ...userInfo, name: data.name, email: data.email, course: data.course };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div>
            <h2 className="my-4">My Profile</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Course</label>
                    <input type="text" name="course" className="form-control" value={formData.course} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile;