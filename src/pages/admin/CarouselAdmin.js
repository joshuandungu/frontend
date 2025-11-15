import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllCarouselItems, createCarouselItem, updateCarouselItem, deleteCarouselItem } from '../../api/api';

const CarouselAdmin = () => {
    const [carouselItems, setCarouselItems] = useState([]);
    const [formData, setFormData] = useState({ title: '', caption: '', link: '', order: 0 });
    const [image, setImage] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const loadCarouselItems = useCallback(async (token) => {
        try {
            setLoading(true);
            const { data } = await fetchAllCarouselItems(token);
            setCarouselItems(data);
        } catch (err) {
            setError('Failed to fetch carousel items.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            if (parsedInfo && parsedInfo.role === 'admin') {
                setUserInfo(parsedInfo);
                loadCarouselItems(parsedInfo.token);
            } else {
                navigate('/');
            }
        } else {
            navigate('/login');
        }
    }, [navigate, loadCarouselItems]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const carouselData = new FormData();
        carouselData.append('title', formData.title);
        carouselData.append('caption', formData.caption);
        carouselData.append('link', formData.link);
        carouselData.append('order', formData.order);
        if (image) {
            carouselData.append('image', image);
        }

        try {
            if (editingItem) {
                // When editing, we should not be sending FormData, but a JSON object.
                // Also, image updates on edit are not handled here, which is a separate concern.
                await updateCarouselItem(editingItem._id, formData, userInfo.token);
                setEditingItem(null);
            } else {
                await createCarouselItem(carouselData, userInfo.token);
            }
            setFormData({ title: '', caption: '', link: '', order: 0 });
            setImage(null);
            e.target.reset();
            loadCarouselItems(userInfo.token);
        } catch (err) {
            setError('Failed to save carousel item.');
            console.error(err);
        }
    }, [editingItem, formData, image, userInfo, loadCarouselItems]);

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            caption: item.caption || '',
            link: item.link || '',
            order: item.order
        });
    };

    const handleDelete = useCallback(async (id) => {
        if (window.confirm('Are you sure you want to delete this carousel item?')) {
            try {
                await deleteCarouselItem(id, userInfo.token);
                loadCarouselItems(userInfo.token);
            } catch (err) {
                setError('Failed to delete carousel item.');
                console.error(err);
            }
        }
    }, [userInfo, loadCarouselItems]);

    const toggleActive = useCallback(async (item) => {
        try {
            await updateCarouselItem(item._id, { isActive: !item.isActive }, userInfo.token);
            loadCarouselItems(userInfo.token);
        } catch (err) {
            setError('Failed to update carousel item.');
            console.error(err);
        }
    }, [userInfo, loadCarouselItems]);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="my-4">Admin - Manage Carousel</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Create/Edit Carousel Item Form */}
            <h3 className="mb-3">{editingItem ? 'Edit' : 'Add New'} Carousel Item</h3>
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="mb-3">
                    <input type="text" name="title" className="form-control" placeholder="Title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="text" name="caption" className="form-control" placeholder="Caption (Optional)" value={formData.caption} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <input type="text" name="link" className="form-control" placeholder="Link (Optional)" value={formData.link} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <input type="number" name="order" className="form-control" placeholder="Order" value={formData.order} onChange={handleChange} />
                </div>
                {!editingItem && (
                    <div className="mb-3">
                        <input type="file" name="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} accept="image/png, image/jpeg, image/webp" required />
                    </div>
                )}
                <button type="submit" className="btn btn-primary me-2">
                    {editingItem ? 'Update' : 'Add'} Item
                </button>
                {editingItem && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingItem(null); setFormData({ title: '', caption: '', link: '', order: 0 }); }}>
                        Cancel
                    </button>
                )}
            </form>

            {/* Existing Carousel Items List */}
            <h3 className="mb-3">Existing Carousel Items</h3>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Caption</th>
                            <th>Order</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carouselItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: '60px', objectFit: 'cover' }} />
                                </td>
                                <td>{item.title}</td>
                                <td>{item.caption}</td>
                                <td>{item.order}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${item.isActive ? 'btn-success' : 'btn-secondary'}`}
                                        onClick={() => toggleActive(item)}
                                    >
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CarouselAdmin;
