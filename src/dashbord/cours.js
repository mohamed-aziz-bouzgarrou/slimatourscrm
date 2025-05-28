import React, { useState } from "react";
import axios from "axios";
import SidBar from "./SidBar";
import { toast } from "react-toastify";

const CreateCourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("67641c3aa51a967306e3774b");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = "http://localhost:3000/api/courses";

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleContentChange = (index, key, value) => {
    const updatedContent = [...content];
    updatedContent[index] = {
      ...updatedContent[index],
      [key]: value,
    };
    setContent(updatedContent);
  };

  const handleAddContent = () => {
    setContent([
      ...content,
      {
        type: "",
        url: "",
        text: "",
        url: null,
        quiz: [{ question: "", options: ["", ""], answer: "" }],
        liveSession: { startTime: "", duration: "" },
      },
    ]);
  };

  const handleRemoveContent = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };

  const handleVideoChange = (index, e) => {
    const updatedContent = [...content];
    updatedContent[index].video = e.target.files[0];
    setContent(updatedContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("instructor", instructor);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("content", JSON.stringify(content));

    // Append files to FormData
    for (let file of files) {
      formData.append("attachedFiles", file);
    }

    // Append video files for content
    content.forEach((item, index) => {
      if (item.video) {
        formData.append(`url${index}`, item.video);
      }
    });

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("crous created successfully!");

      setSuccessMessage(response.data.message);
      setError(""); // Clear previous error messages
    } catch (err) {
      console.log(err);
      setError(err.response ? err.response.data.message : "Error creating course");
      setSuccessMessage(""); // Clear success message
    }
  };

  return (
      <div className="flex h-screen bg-gray-50">
          <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
            <SidBar />
          </div>
          <div className="flex-1 ml-64 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Create a New Course</h2>

      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium">Instructor</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div> */}

        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            {/* Add other categories as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Course Content</label>
          {content.map((item, index) => (
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
                        <input
                          key={optionIndex}
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
          <button
            type="button"
            onClick={handleAddContent}
            className="text-blue-500 mt-4"
          >
            Add Content
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Upload Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Create Course
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateCourseForm;
