import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents, createEvent, deleteEvent } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const EventsAdmin = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ title: '', date: '', description: '', venue: '', registrationLink: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const userToken = useMemo(() => userInfo?.token, [userInfo]);

    const loadEvents = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchEvents();
            setEvents(data);
        } catch (err) {
            setError('Failed to fetch events.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!userToken) return;
        const eventData = new FormData();
        eventData.append('title', formData.title);
        eventData.append('date', formData.date);
        eventData.append('description', formData.description);
        eventData.append('venue', formData.venue);
        eventData.append('registrationLink', formData.registrationLink);
        if (image) {
            eventData.append('image', image);
        }

        try {
            await createEvent(eventData, userToken);
            setFormData({ title: '', date: '', description: '', venue: '', registrationLink: '' }); // Clear form
            setImage(null);
            e.target.reset(); // Clear file input
            loadEvents(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event.');
            console.error(err);
        }
    }, [formData, image, userToken, loadEvents]);

    const handleDelete = useCallback(async (eventId) => {
        if (!userToken) return;
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(eventId, userToken);
                loadEvents(); // Refresh list
            } catch (err) {
                setError('Failed to delete event.');
                console.error(err);
            }
        }
    }, [userToken, loadEvents]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="my-4">Admin - Manage Events</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Create Event Form */}
            <h3 className="mb-3">Add New Event</h3>
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="mb-3"><input type="text" name="title" className="form-control" placeholder="Title" value={formData.title} onChange={handleChange} required /></div>
                <div className="mb-3"><input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required /></div>
                <div className="mb-3"><input type="file" name="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} /></div>
                <div className="mb-3"><textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange} required /></div>
                <div className="mb-3"><input type="text" name="venue" className="form-control" placeholder="Venue (Optional)" value={formData.venue} onChange={handleChange} /></div>
                <div className="mb-3"><input type="text" name="registrationLink" className="form-control" placeholder="Registration Link (Optional)" value={formData.registrationLink} onChange={handleChange} /></div>
                <button type="submit" className="btn btn-primary">Add Event</button>
            </form>

            {/* Existing Events List */}
            <h3 className="mb-3">Existing Events</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/admin/event/${event._id}/edit`} className="btn btn-warning btn-sm me-2">
                                    Edit
                                </Link>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventsAdmin;