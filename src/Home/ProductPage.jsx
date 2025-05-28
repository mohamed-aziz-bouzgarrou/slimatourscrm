import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from '../dashbord/Navbar';
import { toast } from "react-toastify";
import background from "../assets/bot.png"

const ProductPage = () => {
  const { id: botId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [customizationForm, setCustomizationForm] = useState({
    title: '',
    description: '',
    budget: 100,
  }); // State to manage form data

  const navigate = useNavigate();

  const handleBuyNow = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${botId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create booking request');
      }

      const data = await response.json();
      toast.success("Bot created successfully!");

    } catch (err) {
      console.error(err);
      alert('Failed to create booking request. Please try again.');
    }
  };

  const handleCustomizationSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/customized/customize/${botId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          botId,
          ...customizationForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send customization request');
      }

      alert('Customization request sent successfully!');
      setShowModal(false); // Close the modal after successful submission
    } catch (err) {
      console.error(err);
      alert('Failed to send customization request. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bot/${botId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProduct(data.data.bot);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [botId]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-center items-center">
            <img
              src={background}
              alt={product.name}
              className="rounded-lg shadow-md w-full max-w-md object-cover"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-800">{product.name}</h1>
            <p className="text-gray-700 text-lg">{product.description}</p>
            <div className="text-lg">
              <p>
                <span className="font-semibold">Version:</span> {product.version}
              </p>
              <p>
                <span className="font-semibold">Price:</span> <span className="text-green-600">${product.price}</span>
              </p>
              <p>
                <span className="font-semibold">Release Notes:</span> {product.releaseNotes}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
              <p>Updated At: {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleBuyNow}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200"
              >
                Buy Now
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition duration-200"
              >
                Request Customization
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Customization */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Customization</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={customizationForm.title}
                onChange={(e) => setCustomizationForm({ ...customizationForm, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <textarea
                placeholder="Description"
                value={customizationForm.description}
                onChange={(e) => setCustomizationForm({ ...customizationForm, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                rows="4"
              ></textarea>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Budget: ${customizationForm.budget}</label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={customizationForm.budget}
                  onChange={(e) => setCustomizationForm({ ...customizationForm, budget: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomizationSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
