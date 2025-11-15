import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar.js';
import Footer from './pages/Footer.js';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import AdminRegister from './pages/admin/AdminRegister.js';
import Blog from './pages/Blog.js';
import Events from './pages/Events.js';
import Profile from './pages/Profile.js';
import BlogAdmin from './pages/admin/BlogAdmin.js';
import AdminRoute from './pages/AdminRoute.js';
import CreateBlog from './pages/CreateBlog.js';
import Contact from './pages/Contact.js';
import Gallery from './pages/Gallery.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import EventsAdmin from './pages/admin/EventsAdmin.js';
import GalleryAdmin from './pages/admin/GalleryAdmin.js';
import CarouselAdmin from './pages/admin/CarouselAdmin.js';
import ContactAdmin from './pages/admin/ContactAdmin.js';
import UserAdmin from './pages/admin/UserAdmin.js';
import EditBlog from './pages/EditBlog.js';
import CategoryAdmin from './pages/admin/CategoryAdmin.js';

import BlogDetail from './pages/BlogDetail.js';
import EditEvent from './pages/admin/EditEvent.js';
import EventDetail from './pages/EventDetail.js';


function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blog/create" element={<CreateBlog />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserAdmin />} />
            <Route path="blogs" element={<BlogAdmin />} />
            <Route path="blog/:id/edit" element={<EditBlog />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="event/:id/edit" element={<EditEvent />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="carousel" element={<CarouselAdmin />} />
            <Route path="contacts" element={<ContactAdmin />} />
            <Route path="categories" element={<CategoryAdmin />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


export default App;