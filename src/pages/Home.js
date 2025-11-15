import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBlogs, fetchEvents, fetchCategories, fetchCarouselItems } from '../api/api';

const Home = () => {
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [carouselItems, setCarouselItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadHomePageData = async () => {
            try {
                const [blogsRes, eventsRes, categoriesRes, carouselRes] = await Promise.all([
                    fetchBlogs({ limit: 10 }),
                    fetchEvents({ limit: 5 }),
                    fetchCategories(),
                    fetchCarouselItems()
                ]);
                setRecentBlogs(blogsRes.data);
                setUpcomingEvents(eventsRes.data);
                setCategories(categoriesRes.data);
                setCarouselItems(carouselRes.data);
            } catch (err) {
                setError('Failed to load page content. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadHomePageData();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/blog?keyword=${searchQuery}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            {/* Image Carousel */}
            {carouselItems.length > 0 && (
                <section className="mb-5">
                    <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {carouselItems.map((item, index) => (
                                <div key={item._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            <img src={item.imageUrl} className="d-block w-100" alt={item.title} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                                        </a>
                                    ) : (
                                        <img src={item.imageUrl} className="d-block w-100" alt={item.title} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                                    )}
                                    {(item.title || item.caption) && (
                                        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                                            {item.title && <h5>{item.title}</h5>}
                                            {item.caption && <p>{item.caption}</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </section>
            )}

            {/* Search and Categories Section */}
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">BITSA Official Website</h1>
                        <p className="lead text-muted">Your central hub for news, events, and resources from the Business and Information Technology Students' Association.</p>
                        <form onSubmit={handleSearchSubmit} className="my-4">
                            <input
                                type="search"
                                className="form-control form-control-lg"
                                placeholder="Search for articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <div>
                            {categories.map(cat => (
                                <Link key={cat._id} to={`/blog?category=${cat.name}`} className="btn btn-outline-secondary btn-sm m-1">{cat.name}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Carousel */}
            {upcomingEvents.length > 0 && (
                <section className="mb-5">
                    <h2 className="mb-4">Upcoming Events</h2>
                    <div id="eventsCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {upcomingEvents.map((event, index) => (
                                <div key={event._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <Link to={`/events/${event._id}`}>
                                        <img src={event.imageUrl || 'https://via.placeholder.com/800x400?text=Event'} className="d-block w-100" alt={event.title} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                                        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                                            <h5>{event.title}</h5>
                                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#eventsCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#eventsCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </section>
            )}

            {/* Newly Posted Blogs */}
            <section>
                <h2 className="mb-4">Latest From The Blog</h2>
                <div className="row">
                    {recentBlogs.map(blog => (
                        <div key={blog._id} className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <p className="card-text flex-grow-1">{blog.content.substring(0, 100)}...</p>
                                    <p className="card-text"><small className="text-muted">By {blog.author?.name || 'Admin'} on {new Date(blog.createdAt).toLocaleDateString()}</small></p>
                                    <Link to={`/blog/${blog._id}`} className="btn btn-primary mt-auto">Read More</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-3">
                    <Link to="/blog" className="btn btn-outline-primary">View All Posts</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;