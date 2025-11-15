import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEventById, updateEvent } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [formData, setFormData] = useState({ title: '', date: '', description: '', venue: '', registrationLink: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadEvent = useCallback(async () => {
        try {
            const { data } = await fetchEventById(id);
            // Format date for input field
            const eventDate = new Date(data.date).toISOString().split('T')[0];
            setFormData({
                title: data.title,
                date: eventDate,
                description: data.description || '',
                venue: data.venue || '',
                registrationLink: data.registrationLink || ''
            });
        } catch (err) {
            setError('Failed to fetch event details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadEvent();
    }, [loadEvent]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventData = new FormData();
        Object.keys(formData).forEach(key => eventData.append(key, formData[key]));
        if (image) {
            eventData.append('image', image);
        }

        try {
            await updateEvent(id, eventData, userInfo.token);
            navigate('/admin/events');
        } catch (err) {
            setError('Failed to update event.');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="my-4">Edit Event</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="mb-3"><input type="text" name="title" className="form-control" placeholder="Title" value={formData.title} onChange={handleChange} required /></div>
                <div className="mb-3"><input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required /></div>
                <div className="mb-3">
                    <label className="form-label">New Image (Optional)</label>
                    <input type="file" name="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="mb-3"><textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange} required /></div>
                <div className="mb-3"><input type="text" name="venue" className="form-control" placeholder="Venue (Optional)" value={formData.venue} onChange={handleChange} /></div>
                <div className="mb-3"><input type="text" name="registrationLink" className="form-control" placeholder="Registration Link (Optional)" value={formData.registrationLink} onChange={handleChange} /></div>
                <button type="submit" className="btn btn-primary">Update Event</button>
            </form>
        </div>
    );
};

export default EditEvent;