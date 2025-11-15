import React, { useState, useEffect, useCallback } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const CategoryAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchCategories();
            setCategories(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch categories.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleEdit = (category) => {
        setEditingId(category._id);
        setFormData({ name: category.name });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!userInfo || !userInfo.token) {
            setError('You must be logged in to manage categories.');
            return;
        }
        try {
            if (editingId) {
                await updateCategory(editingId, formData, userInfo.token);
            } else {
                await createCategory(formData, userInfo.token);
            }
            handleCancelEdit();
            loadCategories();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save category. It may already exist.');
        }
    }, [editingId, formData, userInfo, loadCategories]);

    const handleDelete = useCallback(async (categoryId) => {
        if (!userInfo || !userInfo.token) {
            setError('You must be logged in to delete a category.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(categoryId, userInfo.token);
                loadCategories();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete category.');
                console.error(err);
            }
        }
    }, [userInfo, loadCategories]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="my-4">Admin - Manage Categories</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-5 card card-body" noValidate>
                <h3 className="mb-3">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Category Name</label>
                    <input type="text" id="name" name="name" className="form-control" placeholder="New category name..." value={formData.name} onChange={handleChange} required />
                </div>
                <div className="d-flex justify-content-end">
                    {editingId && <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>Cancel</button>}
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update Category' : 'Add Category'}</button>
                </div>
            </form>

            <h3 className="mb-3">Existing Categories</h3>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category._id} className="list-group-item d-flex justify-content-between align-items-center">
                        {category.name}
                        <div>
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(category)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(category._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryAdmin;