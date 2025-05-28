import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import Navbar from '../dashbord/Navbar';
import Footer from './Footer';
import axios from 'axios';
import background from '../assets/Rectangle 4687 (1).png'
const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/blog/');
      if (response.data.status === 'success') {
        const blogPosts = response.data.data.data; // Extract blog posts
        setBlogs(blogPosts);
      } else {
        console.error('Error fetching blog posts:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs on component mount
  }, []);

  return (
    <div>
      <Navbar />
      {/* Banner Section */}
      <div className="relative w-full h-64 bg-blue-600">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex justify-center items-center w-full h-full">
          <h1 className="text-white text-4xl font-bold">Welcome to Our Blog</h1>
        </div>
      </div>

      {/* Blog Cards */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={`${background}`} alt={blog.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
                <p className="text-gray-600">{blog.content.substring(0, 100)}...</p>
                <p className="mt-2 text-gray-800 flex items-center">
                  <span className="mr-2 text-red-500">❤️</span>
                  {blog.likes.length} Likes {/* Count the number of likes */}
                </p>
                <Link
                  to={`/Blogs/${blog._id}`}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogListPage;
