import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import Navbar from '../dashbord/Navbar';

const MycoursDetails = () => {
  const { id } = useParams(); // Extract course ID from the URL
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
      <p className="text-md text-gray-500 mb-6">Category: <span className="font-semibold">{course.category}</span></p>

      {/* Instructor Information */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Instructor</h3>
        <p className="text-lg text-gray-700">{course.instructor?.name || 'Instructor name not available'}</p>
        <p className="text-sm text-gray-500">{course.instructor?.email || 'No email available'}</p>
      </div>

      {/* Course Content (Videos, Text, Live Sessions) */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Content</h3>
        <div className="space-y-6">
          {course.content && course.content.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {item.type === 'video' && (
                <div>
                  <h4 className="text-xl font-semibold mb-2">Video</h4>
                  <video className="w-full h-72 object-cover rounded-md shadow-md" controls>
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {item.type === 'text' && (
                <div>
                  <h4 className="text-xl font-semibold mb-2">Text Lesson</h4>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              )}
              {item.quiz && item.quiz.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-800">Quiz</h4>
                  <ul className="list-disc pl-6">
                    {item.quiz.map((quiz, quizIndex) => (
                      <li key={quizIndex} className="mb-4">
                        <p className="text-gray-700 font-semibold">{quiz.question}</p>
                        <ul className="list-disc pl-6">
                          {quiz.options.map((option, optionIndex) => (
                            <li key={optionIndex} className="text-gray-600">{option}</li>
                          ))}
                        </ul>
                        <p className="text-green-500 font-semibold mt-2">Answer: {quiz.answer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attached Files */}
      {course.attachedFiles && course.attachedFiles.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Attached Files</h3>
          <ul className="list-disc pl-6 space-y-2">
            {course.attachedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      {course.reviews && course.reviews.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h3>
          {course.reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
              <p className="font-semibold text-lg">{review.reviewer?.name || 'Anonymous Reviewer'}</p>
              <p className="text-sm text-gray-500">{review.reviewer?.email || 'No email provided'}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="font-semibold text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                <span className="text-sm text-gray-500">{review.rating} / 5</span>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Enrolled Students */}
      {course.enrolledStudents && course.enrolledStudents.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Enrolled Students</h3>
          <ul className="list-disc pl-6">
            {course.enrolledStudents.map((student, index) => (
              <li key={index} className="text-gray-700">
                {student.name} ({student.email})
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

export default MycoursDetails;