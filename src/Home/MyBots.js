import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../dashbord/Navbar';
import Footer from './Footer';
import { toast } from 'react-toastify';

const MyBots = () => {
    const [myBots, setMyBots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBots = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You need to be logged in to view your bots.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:3000/api/bookings/user/accepted-bots', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMyBots(response.data); // Set the fetched bots
            } catch (error) {
                console.error('Error fetching your bots:', error);
                toast.error('Failed to fetch your bots.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyBots();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading your bots...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto my-10 p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Bots</h1>

                {myBots.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">You have no bots yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myBots.map((bot) => (
                            <div key={bot._id} className="bg-blue-50 shadow-lg rounded-lg p-6 border border-blue-200">
                                <h2 className="text-2xl font-semibold text-blue-900 mb-2">{bot.name}</h2>
                                <p className="text-gray-700 mb-4">{bot.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-green-600">${bot.price}</span>
                                    <a
                                        href={bot.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                    >
                                        Download
                                    </a>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-800">
                                        <strong>Version:</strong> {bot.version}
                                    </p>
                                    <p className="text-gray-800">
                                        <strong>Release Notes:</strong> {bot.releaseNotes}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyBots;
