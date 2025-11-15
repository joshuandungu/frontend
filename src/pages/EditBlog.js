import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBlogById, updateBlog, fetchCategories } from '../api/api';
import { useAuth } from '../context/AuthContext';

const EditBlog = () => {
    const [formData, setFormData] = useState({ title: '', content: '', category: '' });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id: blogId } = useParams();
    const { userInfo } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            if (!userInfo) {
                navigate('/login');
                return;
            }
            try {
                const [blogRes, categoriesRes] = await Promise.all([
                    fetchBlogById(blogId),
                    fetchCategories()
                ]);
                const { data: blogData } = blogRes;
                const { data: categoriesData } = categoriesRes;

                setFormData({
                    title: blogData.title,
                    content: blogData.content,
                    category: blogData.category?._id || ''
                });
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to load blog post or categories.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [blogId, userInfo, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!userInfo || !userInfo.token) {
            setError('Authentication error.');
            return;
        }
        try {
            await updateBlog(blogId, formData, userInfo.token);
            navigate('/admin/blogs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="my-4">Edit Blog Post</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        className="form-control"
                        rows="10"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}>
                        <option value="">Select a category</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditBlog;