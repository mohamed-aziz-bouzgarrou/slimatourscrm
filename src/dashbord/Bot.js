import React, { useState } from "react";
import SidBar from "./SidBar";
import axios from "axios";
import { toast } from "react-toastify";

const CreateBot = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    version: "",
    releaseNotes: "",
    file: null, // Ensure the file is tracked here
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      file: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create FormData and append fields with matching names
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("version", formData.version);
    data.append("releaseNotes", formData.releaseNotes);
  
    // Append the file with the correct key: "fileUrl"
    if (formData.file) {
      data.append("fileUrl", formData.file);
    }
  
    try {
      const token =localStorage.getItem('token')
  
      // Send the POST request
      const response = await axios.post("http://localhost:3000/api/bot", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Bot created successfully!");
    } catch (error) {
      console.error("Error creating bot:", error);
      toast.error("Failed to create bot.");
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
        <SidBar />
      </div>

      <div className="flex-1 ml-64 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-gray-800">Create New Bot</h1>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter bot name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter bot description"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter bot price"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Version</label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter bot version"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Bot Software File</label>
            <input
              type="file"
              name="file" // Must match the backend's expected field name
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Release Notes</label>
            <textarea
              name="releaseNotes"
              value={formData.releaseNotes}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter release notes"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Bot
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBot;
