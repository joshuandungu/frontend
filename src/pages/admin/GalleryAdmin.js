import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchGalleryItems, createGalleryItem, deleteGalleryItem, updateGalleryItem } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const GalleryAdmin = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ title: '', caption: '' });
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const userToken = useMemo(() => userInfo?.token, [userInfo]);

    const loadItems = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchGalleryItems();
            setItems(data);
        } catch (err) {
            setError('Failed to fetch gallery items.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({ title: item.title, caption: item.caption || '' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', caption: '' });
        setImage(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!userToken) {
            setError('You must be logged in to manage the gallery.');
            return;
        }
        if (!editingId && !image) {
            setError('Please select an image to upload.');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('caption', formData.caption);
        if (image) {
            data.append('image', image);
        }

        try {
            if (editingId) {
                // Note: Image updates on edit are not supported in this flow.
                await updateGalleryItem(editingId, { title: formData.title, caption: formData.caption }, userToken);
            } else {
                await createGalleryItem(data, userToken);
            }
            handleCancelEdit();
            e.target.reset(); // Reset file input
            loadItems();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to upload image.');
        }
    }, [editingId, formData, image, userToken, loadItems]);

    const handleDelete = useCallback(async (itemId) => {
        if (!userToken) return;
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteGalleryItem(itemId, userToken);
                loadItems();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete item.');
                console.error(err);
            }
        }
    }, [userToken, loadItems]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="my-4">Admin - Manage Gallery</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <h3 className="mb-3">{editingId ? 'Edit Item' : 'Upload New Image'}</h3>
            <form onSubmit={handleSubmit} className="mb-5 card card-body">
                <div className="mb-3"><input type="text" name="title" className="form-control" placeholder="Title" value={formData.title} onChange={handleChange} required /></div>
                <div className="mb-3"><input type="text" name="caption" className="form-control" placeholder="Caption (Optional)" value={formData.caption} onChange={handleChange} /></div>
                {!editingId && (
                    <div className="mb-3"><input type="file" className="form-control" name="image" onChange={(e) => setImage(e.target.files[0])} required /></div>
                )}
                {editingId && <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>Cancel</button>}
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Item' : 'Upload Image'}</button>
            </form>

            <h3 className="mb-3">Existing Gallery Items</h3>
            <div className="row">
                {items.map((item) => (
                    <div key={item._id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={item.imageUrl} className="card-img-top" alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(item)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryAdmin;