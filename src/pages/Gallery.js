import React, { useState, useEffect } from 'react';
import { fetchGalleryItems } from '../api/api';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getItems = async () => {
            try {
                const { data } = await fetchGalleryItems();
                setItems(data);
            } catch (err) {
                setError('Failed to fetch gallery items. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getItems();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="my-4">Gallery</h2>
            {items.length === 0 ? (
                <p>No gallery items found.</p>
            ) : (
                <div className="row">
                    {items.map((item) => (
                        <div key={item._id} className="col-lg-4 col-md-6 mb-4">
                            <div className="card h-100">
                                <img src={item.imageUrl} className="card-img-top" alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    {item.caption && <p className="card-text">{item.caption}</p>}
                                </div>
                                <div className="card-footer">
                                    <small className="text-muted">Uploaded on {new Date(item.createdAt).toLocaleDateString()}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;