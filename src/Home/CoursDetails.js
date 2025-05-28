import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import Navbar from '../dashbord/Navbar';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/courses/${id}`);
        setCourse(response.data.data.course);  // Adjusted to reflect new API response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleBuyCourse = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error('You need to be logged in to book a course.');
        return;
    }
    try {
        const response = await axios.post(
            'http://localhost:3000/api/coursbooking',
            { courseId: id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.message) {
            toast.success(response.data.message);
        } else {
            toast.success('Your booking has been sent successfully.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                toast.error('Course not found.');
            } else if (error.response.status === 400) {
                toast.error('User or Course not found.');
            } else {
                toast.error(error.response.data.message || 'Error sending booking request.');
            }
        } else {
            toast.error('Network error. Please try again.');
        }
        console.error('Error:', error);
    }
};

  const handleFileDownload = (fileUrl) => {
    const confirmDownload = window.confirm('You need to buy the course before downloading. Do you want to proceed?');
    if (confirmDownload) {
      window.open(fileUrl, '_blank');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center py-8">Course not found</div>;
  }

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto m-10 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{course.title}</h1>
        <p className="text-lg text-gray-700 mb-4">{course.description}</p>
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-xl font-semibold text-green-500">${course.price}</span>
          {course.discountedPrice && (
            <span className="text-lg line-through text-gray-500">${course.discountedPrice}</span>
          )}
        </div>
        <button onClick={handleBuyCourse} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Request to Buy Course
        </button>

        {/* Attached Files */}
        {course.attachedFiles && course.attachedFiles.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Attached Files</h3>
            <ul className="list-disc pl-6 space-y-2">
              {course.attachedFiles.map((file, index) => (
                <li key={index}>
                  <button onClick={() => handleFileDownload(file.url)} className="text-blue-600 hover:underline">
                    {file.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default CourseDetails;
