import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidBar from './SidBar';
import { toast } from "react-toastify";

export default function UpdateCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        content: [],
        attachedFiles: []
    });

    const [newContent, setNewContent] = useState({
        type: 'video', // Default to video type
        url: '',
        text: '',
        quiz: [],
        liveSession: { startTime: '', duration: '' }
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/courses/${id}`);
                setCourse(response.data.data.course);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };
        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleContentChange = (index, field, value) => {
        const updatedContent = [...course.content];
        updatedContent[index] = { ...updatedContent[index], [field]: value };
        setCourse({ ...course, content: updatedContent });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/courses/${id}`, course);
        toast.success("cours updated successfully!");
            
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    const handleAddContent = () => {
        try {
            const updatedContent = [...course.content, newContent];
            const updatedCourse = { ...course, content: updatedContent };
            setCourse(updatedCourse);
            setNewContent({ type: 'video', url: '', text: '', quiz: [], liveSession: { startTime: '', duration: '' } }); // Reset content form
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    const handleRemoveContent = (index) => {
        const updatedContent = course.content.filter((_, idx) => idx !== index);
        setCourse({ ...course, content: updatedContent });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
                <SidBar />
            </div>
            <div className="flex-1 ml-64 p-6 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Update Course</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full p-2 border border-gray-400 rounded"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        placeholder="Course Title"
                        required
                    />
                    <textarea
                        className="w-full p-2 border border-gray-400 rounded"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                    ></textarea>
                    <input
                        className="w-full p-2 border border-gray-400 rounded"
                        type="number"
                        name="price"
                        value={course.price}
                        onChange={handleChange}
                        placeholder="Price"
                        required
                    />
                    <input
                        className="w-full p-2 border border-gray-400 rounded"
                        name="category"
                        value={course.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                    />

                    <h2 className="mt-6 text-xl font-semibold">Content</h2>
                    {course.content.map((item, index) => (
  <div key={index} className="mb-4 border p-4 rounded">
    <div className="mb-4">
      <label className="block text-sm font-medium">Content Type</label>
      <select
        value={item.type}
        onChange={(e) => handleContentChange(index, "type", e.target.value)}
        className="mt-1 p-2 w-full border border-gray-300 rounded"
      >
        <option value="">Select Type</option>
        <option value="text">Text</option>
        <option value="quiz">Quiz</option>
        <option value="liveSession">Live Session</option>
      </select>
    </div>

    {item.type === "video" && (
      <div className="mb-4">
        <label className="block text-sm font-medium">Upload Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleVideoChange(index, e)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
    )}

    {item.type === "text" && (
      <div className="mb-4">
        <label className="block text-sm font-medium">Text Content</label>
        <textarea
          value={item.text}
          onChange={(e) => handleContentChange(index, "text", e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
    )}

    {item.type === "quiz" && (
      <div>
        <label className="block text-sm font-medium">Quiz</label>
        {item.quiz.map((quizItem, quizIndex) => (
          <div key={quizIndex} className="mb-4">
            <label className="block text-sm font-medium">Question</label>
            <input
              type="text"
              value={quizItem.question}
              onChange={(e) =>
                handleContentChange(index, "quiz", [
                  ...item.quiz.slice(0, quizIndex),
                  { ...quizItem, question: e.target.value },
                  ...item.quiz.slice(quizIndex + 1),
                ])
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded"
            />

            <label className="block text-sm font-medium">Options</label>
            {quizItem.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleContentChange(index, "quiz", [
                      ...item.quiz.slice(0, quizIndex),
                      {
                        ...quizItem,
                        options: [
                          ...quizItem.options.slice(0, optionIndex),
                          e.target.value,
                          ...quizItem.options.slice(optionIndex + 1),
                        ],
                      },
                      ...item.quiz.slice(quizIndex + 1),
                    ])
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    )}

    {item.type === "liveSession" && (
      <div className="mb-4">
        <label className="block text-sm font-medium">Live Session Start Time</label>
        <input
          type="datetime-local"
          value={item.liveSession.startTime}
          onChange={(e) =>
            handleContentChange(index, "liveSession", {
              ...item.liveSession,
              startTime: e.target.value,
            })
          }
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
        <label className="block text-sm font-medium">Live Session Duration (minutes)</label>
        <input
          type="number"
          value={item.liveSession.duration}
          onChange={(e) =>
            handleContentChange(index, "liveSession", {
              ...item.liveSession,
              duration: e.target.value,
            })
          }
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
    )}

    <button
      type="button"
      onClick={() => handleRemoveContent(index)}
      className="text-red-500 mt-2"
    >
      Remove Content
    </button>
  </div>
))}


                    <h2 className="mt-6 text-xl font-semibold">Add New Content</h2>
                    <div className="space-y-2">
                        <select
                            name="type"
                            value={newContent.type}
                            onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                            className="w-full p-2 border border-gray-400 rounded"
                        >
                            <option value="video">Video</option>
                            <option value="text">Text</option>
                            <option value="quiz">Quiz</option>
                            <option value="liveSession">Live Session</option>
                        </select>

                        {newContent.type === 'video' && (
                            <input
                                className="w-full p-2 border border-gray-400 rounded"
                                name="url"
                                value={newContent.url}
                                onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                                placeholder="Video URL"
                            />
                        )}
                        {newContent.type === 'text' && (
                            <textarea
                                className="w-full p-2 border border-gray-400 rounded"
                                name="text"
                                value={newContent.text}
                                onChange={(e) => setNewContent({ ...newContent, text: e.target.value })}
                                placeholder="Text Content"
                            />
                        )}

                        <button
                            type="button"
                            onClick={handleAddContent}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Add Content
                        </button>
                    </div>

                    <button type="submit" className="px-4 py-2 border border-gray-400 text-black rounded hover:bg-gray-200">
                        Update Course
                    </button>
                </form>
            </div>
        </div>
    );
}
