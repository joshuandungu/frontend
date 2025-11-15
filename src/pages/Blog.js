import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, fetchCategories } from '../api/api';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    // State for filters
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        date: ''
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));

        const loadInitialData = async () => {
            try {
                const { data } = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        loadInitialData();
        loadBlogs();
    }, []);

    const loadBlogs = async (currentFilters = filters) => {
        setLoading(true);
        try {
            // Remove empty filters before sending
            const activeFilters = Object.fromEntries(
                Object.entries(currentFilters).filter(([, value]) => value !== '')
            );
            const { data } = await fetchBlogs(activeFilters);
            setBlogs(data);
        } catch (err) {
            setError('Failed to fetch blog posts. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        loadBlogs();
    };

    const handleResetFilters = () => {
        const reset = { keyword: '', category: '', date: '' };
        setFilters(reset);
        loadBlogs(reset);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h2>BITSA Blog</h2>
                {userInfo && (
                    <Link to="/blog/create" className="btn btn-success">
                        + Create Post
                    </Link>
                )}
            </div>

            {/* Filter Section */}
            <form onSubmit={handleFilterSubmit} className="card card-body mb-4">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label htmlFor="keyword" className="form-label">Search</label>
                        <input type="text" id="keyword" name="keyword" className="form-control" placeholder="Search by keyword..." value={filters.keyword} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select id="category" name="category" className="form-select" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All</option>
                            {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input type="date" id="date" name="date" className="form-control" value={filters.date} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-2 d-flex">
                        <button type="submit" className="btn btn-primary w-100 me-2">Filter</button>
                        <button type="button" className="btn btn-secondary w-100" onClick={handleResetFilters}>Reset</button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    {blogs.length === 0 ? (
                        <p>No blog posts found matching your criteria.</p>
                    ) : (
                        <div className="row">
                            {blogs.map((blog) => (
                                <div key={blog._id} className="col-lg-3 col-md-6 mb-4">
                                    <div className="card h-100 d-flex flex-column">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{blog.title}</h5>
                                            <p className="card-text flex-grow-1">{blog.content.substring(0, 150)}...</p>
                                            <p className="card-text"><small className="text-muted">Posted by {blog.author?.name || 'Admin'} on {new Date(blog.createdAt).toLocaleDateString()}</small></p>
                                            <Link to={`/blog/${blog._id}`} className="btn btn-primary mt-auto">Read More</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Blog;