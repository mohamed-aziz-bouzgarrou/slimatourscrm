import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../dashbord/Navbar';
import Footer from './Footer';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/courses/');
        setCourses(response.data.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div>

   
    <Navbar/>
    <div className="container mx-auto m-10 p-4">
      <h1 className="text-4xl font-semibold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-green-500">${course.price}</span>
              <Link to={`/course-details/${course._id}`} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default CoursesList;
