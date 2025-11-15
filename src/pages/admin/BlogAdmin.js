import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllBlogsForAdmin, updateBlog, deleteBlog } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const userToken = useMemo(() => userInfo?.token, [userInfo]);

    const loadBlogs = useCallback(async () => {
        if (!userToken) return;
        try {
            setLoading(true);
            const { data } = await fetchAllBlogsForAdmin(userToken);
            setBlogs(data);
        } catch (err) {
            setError('Failed to fetch blogs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        loadBlogs();
    }, [loadBlogs]);

    const handleApprove = useCallback(async (blogId) => {
        if (!userToken) return;
        try {
            await updateBlog(blogId, { status: 'approved' }, userToken);
            // Refresh the list
            loadBlogs();
        } catch (err) {
            setError('Failed to approve post.');
            console.error(err);
        }
    }, [userToken, loadBlogs]);

    const handleDelete = useCallback(async (blogId) => {
        if (!userToken) return;
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteBlog(blogId, userToken);
                // Refresh the list
                loadBlogs();
            } catch (err) {
                setError('Failed to delete post.');
                console.error(err);
            }
        }
    }, [userToken, loadBlogs]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="my-4">Admin - Manage Blogs</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{blog.author?.name || 'N/A'}</td>
                            <td><span className={`badge bg-${blog.status === 'approved' ? 'success' : 'warning'}`}>{blog.status}</span></td>
                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                            <td>
                                {blog.status !== 'approved' && <button className="btn btn-sm btn-success me-2" onClick={() => handleApprove(blog._id)}>Approve</button>}
                                <Link to={`/admin/blog/${blog._id}/edit`} className="btn btn-sm btn-primary me-2">Edit</Link>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(blog._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogAdmin;