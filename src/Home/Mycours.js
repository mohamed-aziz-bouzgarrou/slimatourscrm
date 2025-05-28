import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../dashbord/Navbar';
import Footer from './Footer';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You need to be logged in to view your courses.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:3000/api/coursbooking/accepted', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Map the response to extract the course details
                const courses = response.data.map((booking) => booking.course);
                setMyCourses(courses);
            } catch (error) {
                console.error('Error fetching your courses:', error);
                toast.error('Failed to fetch your courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading your courses...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto my-10 p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Courses</h1>

                {myCourses.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">You have no courses yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.map((course) => (
                            <div key={course._id} className="bg-blue-50 shadow-lg rounded-lg p-6 border border-blue-200">
                                <h2 className="text-2xl font-semibold text-blue-900 mb-2">{course.title}</h2>
                                <p className="text-gray-700 mb-4">{course.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-green-600">${course.price}</span>
                                    <Link to={`/Mycourse-details/${course._id}`} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                        View Course
                                    </Link>
                                </div>
                                {/* Display attached files if available */}
                                {course.attachedFiles?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Attached Files:</h3>
                                        <ul>
                                            {course.attachedFiles.map((file) => (
                                                <li key={file._id}>
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {file.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyCourses;
