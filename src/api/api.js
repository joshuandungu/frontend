import axios from 'axios';


const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://bitsa-backend-zv10.onrender.com/api' });


export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const fetchProfile = (token) => API.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (data, token) => API.put('/auth/profile', data, { headers: { Authorization: `Bearer ${token}` } });


export const updateGalleryItem = (id, data, token) => API.put(`/gallery/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const fetchBlogs = (params) => API.get('/blogs', { params });
export const fetchBlogById = (id) => API.get(`/blogs/${id}`);
export const createBlog = (data, token) => API.post('/blogs', data, { headers: { Authorization: `Bearer ${token}` } });
export const fetchAllBlogsForAdmin = (token) => API.get('/blogs/admin', { headers: { Authorization: `Bearer ${token}` } });
export const updateBlog = (id, data, token) => API.put(`/blogs/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteBlog = (id, token) => API.delete(`/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const likeBlog = (id, token) => API.put(`/blogs/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const addBlogComment = (id, data, token) => API.post(`/blogs/${id}/comments`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteBlogComment = (blogId, commentId, token) => API.delete(`/blogs/${blogId}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });

// Categories
export const fetchCategories = () => API.get('/categories');
export const createCategory = (data, token) => API.post('/categories', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateCategory = (id, data, token) => API.put(`/categories/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteCategory = (id, token) => API.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });


export const fetchEvents = (params) => API.get('/events', { params });
export const fetchEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (data, token) => API.post('/events', data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
export const updateEvent = (id, data, token) => API.put(`/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
export const deleteEvent = (id, token) => API.delete(`/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const likeEvent = (id, token) => API.put(`/events/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const addEventComment = (id, data, token) => API.post(`/events/${id}/comments`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteEventComment = (eventId, commentId, token) => API.delete(`/events/${eventId}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });

// Contacts
export const fetchContacts = () => API.get('/contacts');
export const sendContactMessage = (data) => API.post('/contacts/message', data);
export const createContact = (data, token) => API.post('/contacts', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateContact = (id, data, token) => API.put(`/contacts/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteContact = (id, token) => API.delete(`/contacts/${id}`, { headers: { Authorization: `Bearer ${token}` } });


export const fetchGalleryItems = () => API.get('/gallery');
export const createGalleryItem = (data, token) => API.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
export const deleteGalleryItem = (id, token) => API.delete(`/gallery/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Carousel
export const fetchCarouselItems = () => API.get('/carousel');
export const fetchAllCarouselItems = (token) => API.get('/carousel/admin', { headers: { Authorization: `Bearer ${token}` } });
export const createCarouselItem = (data, token) => API.post('/carousel', data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
export const updateCarouselItem = (id, data, token) => API.put(`/carousel/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteCarouselItem = (id, token) => API.delete(`/carousel/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Admin
export const fetchAdminStats = (token) => API.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
export const fetchAdminUsers = (token) => API.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } });
export const updateUserStatus = (id, status, token) => API.put(`/admin/users/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
export const deleteUser = (id, token) => API.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Notifications
export const fetchNotifications = (token) => API.get('/notifications', { headers: { Authorization: `Bearer ${token}` } });
export const markNotificationAsRead = (id, token) => API.put(`/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const markAllNotificationsAsRead = (token) => API.put('/notifications/read-all', {}, { headers: { Authorization: `Bearer ${token}` } });


export default API;