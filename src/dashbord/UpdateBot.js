import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SidBar from './SidBar';
import { toast } from "react-toastify";

export default function UpdateBot() {
    const [bot, setBot] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [version, setVersion] = useState('');
    const [releaseNotes, setReleaseNotes] = useState('');
    const [file, setFile] = useState(null); // To store selected file
    const { id } = useParams(); // Extracting bot ID from URL
    const navigate = useNavigate();

    // Fetch bot details by ID
    const getBot = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/bot/${id}`);
            const botData = response.data.data.bot;
            setBot(botData);
            setName(botData.name);
            setDescription(botData.description);
            setPrice(botData.price);
            setVersion(botData.version);
            setReleaseNotes(botData.releaseNotes);
        } catch (error) {
            console.error('Error fetching bot details:', error);
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Save the selected file
    };

    // Update bot information
    const updateBot = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('version', version);
        formData.append('releaseNotes', releaseNotes);
        if (file) {
            formData.append('fileUrl', file); // Append file if selected
        }

        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        try {
            await axios.put(`http://localhost:3000/api/bot/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add Authorization header with token
                    'Content-Type': 'multipart/form-data',
                }
            });
        toast.success("bot updated successfully!");
        } catch (error) {
            console.error('Error updating bot:', error);
        }
    };

    useEffect(() => {
        getBot();
    }, [id]);

    if (!bot) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
                <SidBar />
            </div>
            <div className="flex-1 ml-64 p-6">
                <div className="mx-auto container py-20 px-6">
                    <h2 className="text-2xl font-bold mb-6">Update Bot</h2>
                    <form onSubmit={updateBot} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bot Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                rows="4"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Version</label>
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Release Notes</label>
                            <textarea
                                value={releaseNotes}
                                onChange={(e) => setReleaseNotes(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                rows="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload File (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Update Bot
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-400 text-black rounded-md hover:bg-gray-200"
                                onClick={() => navigate('/bots')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
