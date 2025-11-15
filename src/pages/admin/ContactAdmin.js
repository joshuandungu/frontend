import React, { useState, useEffect, useCallback } from 'react';
import { fetchContacts, createContact, updateContact, deleteContact } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const ContactAdmin = () => {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({ type: 'official', title: '', name: '', email: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const loadContacts = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchContacts();
            setContacts(data);
        } catch (err) {
            setError('Failed to fetch contacts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userInfo) {
            loadContacts();
        }
    }, [userInfo, loadContacts]);

    const handleEdit = (contact) => {
        setEditingId(contact._id);
        setFormData({ type: contact.type, title: contact.title, name: contact.name || '', email: contact.email });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ type: 'official', title: '', name: '', email: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateContact(editingId, formData, userInfo.token);
            } else {
                await createContact(formData, userInfo.token);
            }
            handleCancelEdit();
            loadContacts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save contact.');
        }
    };

    const handleDelete = useCallback(async (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await deleteContact(contactId, userInfo.token);
                loadContacts(); // Refresh list
            } catch (err) {
                setError('Failed to delete contact.');
                console.error(err);
            }
        }
    }, [userInfo, loadContacts]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="my-4">Admin - Manage Contacts</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <h3 className="mb-3">{editingId ? 'Edit Contact' : 'Add New Contact'}</h3>
            <form onSubmit={handleSubmit} className="mb-5 card card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Type</label>
                        <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                            <option value="official">Official</option>
                            <option value="executive">Executive</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" placeholder="e.g., President, BITSA Email" value={formData.title} onChange={handleChange} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name (Optional)</label>
                        <input type="text" name="name" className="form-control" placeholder="e.g., John Doe" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" placeholder="e.g., president@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    {editingId && <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>Cancel</button>}
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update Contact' : 'Add Contact'}</button>
                </div>
            </form>

            <h3 className="mb-3">Existing Contacts</h3>
            <ul className="list-group">
                {contacts.map((contact) => (
                    <li key={contact._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{contact.title}</strong> ({contact.type})<br />
                            <small>{contact.name ? `${contact.name} - ` : ''}{contact.email}</small>
                        </div>
                        <div>
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(contact)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactAdmin;