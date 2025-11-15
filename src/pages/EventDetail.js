import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById, likeEvent, addEventComment, deleteEventComment } from '../api/api';

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
        const getEvent = async () => {
            try {
                const { data } = await fetchEventById(id);
                setEvent(data);
            } catch (err) {
                setError('Failed to fetch event details. It may not exist.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getEvent();
    }, [id]);

    const handleLike = async () => {
        if (!userInfo) return;
        try {
            const { data } = await likeEvent(id, userInfo.token);
            setEvent(data);
        } catch (err) {
            console.error("Failed to like event", err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo || !commentText.trim()) return;
        try {
            await addEventComment(id, { text: commentText }, userInfo.token);
            setCommentText('');
            const { data } = await fetchEventById(id);
            setEvent(data);
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!userInfo) return;
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteEventComment(id, commentId, userInfo.token);
                const { data } = await fetchEventById(id);
                setEvent(data);
            } catch (err) {
                console.error("Failed to delete comment", err);
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `Check out this event on the BITSA website: ${event.title}`,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link to event copied to clipboard!');
        }
    };

    const hasLiked = userInfo && event?.likes.includes(userInfo.user.id);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!event) return <div>Event not found.</div>;

    return (
        <div className="my-4">
            <Link to="/events" className="btn btn-light mb-3">Go Back</Link>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="img-fluid rounded mb-3" style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }} />}
            <h1>{event.title}</h1>
            <div className="d-flex justify-content-between text-muted mb-3">
                <span><strong>Event Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                <span><strong>Posted:</strong> {new Date(event.createdAt).toLocaleDateString()} by {event.organiser?.name || 'Admin'}</span>
            </div>
            <div className="mt-4">
                <h4>Description</h4>
                <p>{event.description}</p>
            </div>

            {event.venue && <p><strong>Venue:</strong> {event.venue}</p>}

            {event.registrationLink && (
                <div className="mt-4">
                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Register Here</a>
                </div>
            )}

            {/* Actions: Like and Share */}
            <div className="my-4">
                <button onClick={handleLike} className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline-primary'} me-2`} disabled={!userInfo}>
                    <i className="bi bi-hand-thumbs-up"></i> {hasLiked ? 'Liked' : 'Like'} ({event.likes.length})
                </button>
                <button onClick={handleShare} className="btn btn-outline-secondary">
                    <i className="bi bi-share"></i> Share
                </button>
            </div>

            <hr />

            {/* Comments Section */}
            <div className="mt-4">
                <h4>Comments ({event.comments.length})</h4>
                {userInfo ? (
                    <form onSubmit={handleCommentSubmit} className="my-3">
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Post Comment</button>
                    </form>
                ) : (
                    <p><Link to="/login">Log in</Link> to post a comment.</p>
                )}

                <div className="mt-4">
                    {event.comments.map((comment) => (
                        <div key={comment._id} className="card mb-3">
                            <div className="card-body">
                                <p className="card-text">{comment.text}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">By {comment.name} on {new Date(comment.createdAt).toLocaleDateString()}</small>
                                    {(userInfo?.user.role === 'admin' || userInfo?.user.id === comment.user) && (
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventDetail;