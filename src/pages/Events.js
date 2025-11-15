import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../api/api';
import { Link } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            try {
                const { data } = await fetchEvents();
                setEvents(data);
            } catch (err) {
                setError('Failed to fetch events. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="my-4">Upcoming Events</h2>
            {events.length === 0 ? (
                <p>No upcoming events found.</p>
            ) : (
                events.map((event) => (
                    <Link to={`/events/${event._id}`} key={event._id} className="card mb-4 text-decoration-none text-dark">
                        <div className="row g-0">
                            {event.imageUrl && (
                                <div className="col-md-4">
                                    <img src={event.imageUrl} className="img-fluid rounded-start h-100" alt={event.title} style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-text">{event.description.substring(0, 200)}...</p>
                                    <p className="card-text"><small className="text-muted">Event Date: {new Date(event.date).toLocaleDateString()}</small></p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

export default Events;