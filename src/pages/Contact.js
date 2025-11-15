import React, { useState, useEffect } from 'react';
import { sendContactMessage, fetchContacts } from '../api/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(true);

    useEffect(() => {
        const getContacts = async () => {
            try {
                const { data } = await fetchContacts();
                setContacts(data);
            } catch (err) {
                // We can set an error here, but for now, we'll just log it
                // as the hardcoded values can serve as a fallback.
                console.error("Failed to fetch dynamic contacts", err);
            } finally {
                setContactsLoading(false);
            }
        };

        getContacts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await sendContactMessage(formData);
            setSuccess(data.message || 'Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send message. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="my-4">Contact Us</h2>

            <h3 className="mb-3">Official Contacts</h3>
            {contactsLoading ? (
                <p>Loading contact details...</p>
            ) : (
                <div className="row">
                    {contacts.filter(c => c.type === 'official').map(contact => (
                        <div key={contact._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{contact.title}</h5>
                                    <p className="card-text mb-1"><i className="bi bi-envelope-fill me-2"></i><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                                    {contact.phone && <p className="card-text"><i className="bi bi-telephone-fill me-2"></i>{contact.phone}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h3 className="mb-3 mt-4">Executive Members</h3>
            {contactsLoading ? null : (
                <div className="row">
                    {contacts.filter(c => c.type === 'executive').map(contact => (
                        <div key={contact._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{contact.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{contact.name}</h6>
                                    <p className="card-text mb-1"><i className="bi bi-envelope-fill me-2"></i><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                                    {contact.phone && <p className="card-text"><i className="bi bi-telephone-fill me-2"></i><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <hr />

            <h3>Send us a Message</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Your Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Subject (Optional)</label>
                    <input type="text" name="subject" className="form-control" value={formData.subject} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-control" value={formData.message} onChange={handleChange} required rows="5" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}

export default Contact;