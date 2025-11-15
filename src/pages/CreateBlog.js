import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog, fetchCategories } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null); // State for the image file
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const loadCategories = async () => {
                try {
                    const { data } = await fetchCategories();
                    setCategories(data);
                    if (data.length > 0) {
                        setCategory(data[0]._id); // Default to the first category
                    }
                } catch (err) {
                    console.error('Failed to fetch categories', err);
                }
            };
            loadCategories();
        }
    }, [userInfo, navigate]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError('Title and content are required.');
            return;
        }

        setLoading(true);
        setError('');

        // Use FormData to send file and text data together
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        if (image) {
            formData.append('image', image); // The key 'image' must match the backend (upload.single('image'))
        }

        try {
            await createBlog(formData, userInfo.token);

            // On success, redirect to the main blog page
            navigate('/blog');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create post. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>; // Or a redirect component
    }

    return (
        <div>
            <h2 className="my-4">Create a New Blog Post</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                        id="content"
                        className="form-control"
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required>
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Featured Image (Optional)</label>
                    <input
                        type="file"
                        id="image"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Post'}
                </button>
            </form>
        </div>
    );
};

export default CreateBlog;