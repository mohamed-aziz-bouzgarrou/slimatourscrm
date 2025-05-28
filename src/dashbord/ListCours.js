import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidBar from './SidBar';

export default function ListCours() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();

    const getCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/courses/');
            setCourses(response.data.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const deleteCourse = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/courses/${id}`);
            setCourses(courses.filter(course => course._id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
                <SidBar />
            </div>
            <div className="flex-1 ml-64 p-6 overflow-auto">
                <div className="mx-auto container py-20 px-6">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="rounded">
                                <div className="w-full h-64 flex flex-col justify-between bg-white border border-gray-400 rounded-lg p-4">
                                    <div>
                                        <h4 className="text-gray-800 font-bold mb-3">{course.title}</h4>
                                        <p className="text-gray-800 text-sm">{course.description}</p>
                                        <p className="text-sm mt-2">Content Count: {course.content.length}</p>
                                        <p className="text-sm mt-1">Content Types: {course.content.map(c => c.type).join(", ")}</p>
                                        <p className="text-sm mt-1">Enrolled Students: {course.enrolledStudents.length}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-800">
                                        <p className="text-sm">Price: ${course.price}</p>
                                     
                                    </div>
                                    <div className="flex gap-2">
                                            <button 
                                                className="px-3 py-1 border border-gray-400 text-black rounded hover:bg-gray-200"
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                See Details
                                            </button>
                                            <button 
                                                className="px-3 py-1 border border-gray-400 text-black rounded hover:bg-gray-200"
                                                onClick={() => deleteCourse(course._id)}
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                className="px-3 py-1 border border-gray-400 text-black rounded hover:bg-gray-200"
                                                onClick={() => navigate(`/update-course/${course._id}`)}
                                            >
                                                Update Course
                                            </button>
                                        </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg overflow-y-auto max-h-[80vh]">
                        <h2 className="text-xl font-bold mb-4">{selectedCourse.title}</h2>
                        <p><strong>Description:</strong> {selectedCourse.description}</p>
                        <p><strong>Category:</strong> {selectedCourse.category}</p>
                        <p><strong>Content Count:</strong> {selectedCourse.content.length}</p>
                        <p><strong>Content Types:</strong> {selectedCourse.content.map(c => `${c.type}: ${c.url || c.text}`).join(", ")}</p>
                        <p><strong>Enrolled Students:</strong> {selectedCourse.enrolledStudents.length}</p>
                        <p><strong>Price:</strong> ${selectedCourse.price}</p>
                        <p><strong>Attached Files:</strong></p>
                        <ul>
                            {selectedCourse.attachedFiles.map(file => (
                                <li key={file._id}><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></li>
                            ))}
                        </ul>
                        <button 
                            className="mt-4 px-4 py-2 border border-gray-400 text-black rounded hover:bg-gray-200"
                            onClick={() => setSelectedCourse(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
