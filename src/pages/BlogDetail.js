import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogById, likeBlog, addBlogComment, deleteBlogComment } from '../api/api';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const { id } = useParams();
    const { userInfo } = useAuth(); // Use the AuthContext

    useEffect(() => {
        const getBlog = async () => {
            try {
                const { data } = await fetchBlogById(id);
                setBlog(data);
            } catch (err) {
                setError('Failed to fetch blog post. It may not exist.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getBlog();
    }, [id]);

    const handleLike = async () => {
        if (!userInfo) return; // Or redirect to login
        try {
            const { data } = await likeBlog(id, userInfo.token);
            setBlog(data);
        } catch (err) {
            console.error("Failed to like post", err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo || !commentText.trim()) return;
        try {
            const { data } = await addBlogComment(id, { text: commentText }, userInfo.token);
            setCommentText('');
            setBlog(prevBlog => ({ ...prevBlog, comments: data })); // Update comments from response
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!userInfo) return;
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteBlogComment(id, commentId, userInfo.token);
                // Refresh blog to remove comment
                const { data } = await fetchBlogById(id);
                setBlog(data);
            } catch (err) {
                console.error("Failed to delete comment", err);
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: `Check out this article on the BITSA website: ${blog.title}`,
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const hasLiked = userInfo && blog?.likes.includes(userInfo.user.id);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!blog) return <div>Blog post not found.</div>;

    return (
        <div className="my-4">
            <Link to="/blog" className="btn btn-light mb-3">Go Back</Link>
            <h1>{blog.title}</h1>
            <p className="text-muted">
                Posted by {blog.author?.name || 'Admin'} on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="img-fluid rounded my-3" />}
            <div className="mt-4" style={{ whiteSpace: 'pre-wrap' }}>
                {blog.content}
            </div>

            {/* Actions: Like and Share */}
            <div className="my-4">
                <button onClick={handleLike} className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline-primary'} me-2`} disabled={!userInfo}>
                    <i className="bi bi-hand-thumbs-up"></i> {hasLiked ? 'Liked' : 'Like'} ({blog.likes.length})
                </button>
                <button onClick={handleShare} className="btn btn-outline-secondary">
                    <i className="bi bi-share"></i> Share
                </button>
            </div>

            <hr />

            {/* Comments Section */}
            <div className="mt-4">
                <h4>Comments ({blog.comments.length})</h4>
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
                    {blog.comments.map((comment) => (
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

export default BlogDetail;