import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidBar from './SidBar';
export default function ListBots() {
    const [bots, setBots] = useState([]);
    const [selectedBot, setSelectedBot] = useState(null);
    const navigate = useNavigate();

    // Fetching the list of bots from the API
    const getBots = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/bot');
            setBots(response.data.data.bots);
        } catch (error) {
            console.error('Error fetching bots:', error);
        }
    };
const token=localStorage.getItem('token');
    const deleteBot = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/bot/${id}` ,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
            }
       );
            setBots(bots.filter(bot => bot._id !== id));
        } catch (error) {
            console.error('Error deleting bot:', error);
        }
    };

    useEffect(() => {
        getBots();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
                <SidBar />
            </div>
            <div className="flex-1 ml-64 p-6 overflow-auto">
                <div className="mx-auto container py-20 px-6">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {bots.map((bot) => (
                            <div key={bot._id} className="rounded">
                                <div className="w-full h-64 flex flex-col justify-between bg-white border border-gray-400 rounded-lg p-4">
                                    <div>
                                        <h4 className="text-gray-800 font-bold mb-3">{bot.name}</h4>
                                        <p className="text-gray-800 text-sm">{bot.description}</p>
                                        <p className="text-sm mt-2">Version: {bot.version}</p>
                                        <p className="text-sm mt-2">Price: ${bot.price}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-800">
                                        <p className="text-sm">Created At: {new Date(bot.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className="px-3 py-1 border border-gray-400 text-black rounded hover:bg-gray-200"
                                            onClick={() => setSelectedBot(bot)}
                                        >
                                            See Details
                                        </button>
                                        <button 
                                            className="px-3 py-1 border border-gray-400 text-black rounded hover:bg-gray-200"
                                            onClick={() => deleteBot(bot._id)}
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            className="px-3 py-1 border border-gray-400 text-black rounded hover:bg-gray-200"
                                            onClick={() => navigate(`/update-bot/${bot._id}`)}
                                        >
                                            Update Bot
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedBot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg overflow-y-auto max-h-[80vh]">
                        <h2 className="text-xl font-bold mb-4">{selectedBot.name}</h2>
                        <p><strong>Description:</strong> {selectedBot.description}</p>
                        <p><strong>Version:</strong> {selectedBot.version}</p>
                        <p><strong>Price:</strong> ${selectedBot.price}</p>
                        <p><strong>Release Notes:</strong> {selectedBot.releaseNotes}</p>
                        <p><strong>File URL:</strong> <a href={selectedBot.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Download PDF</a></p>
                        <p><strong>Created At:</strong> {new Date(selectedBot.createdAt).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedBot.updatedAt).toLocaleString()}</p>
                        <button 
                            className="mt-4 px-4 py-2 border border-gray-400 text-black rounded hover:bg-gray-200"
                            onClick={() => setSelectedBot(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
