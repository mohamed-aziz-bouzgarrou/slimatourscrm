import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import MarketToolsSection from "./MarketToolSection";
import GrowBusinessSection from "./GrowBusinessSection";
import Navbar from "../dashbord/Navbar";
import background from "../assets/bot.png"

const ProductCard = ({ image, title, rating, reviews, description, id }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/BtDetails/${id}`);
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <img src={background} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="flex items-center mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.453a1 1 0 00-.364 1.118l1.286 3.965c.3.921-.755 1.688-1.54 1.118L10 13.348l-3.37 2.453c-.785.57-1.84-.197-1.54-1.118l1.286-3.965a1 1 0 00-.364-1.118L2.64 9.391c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                </svg>
              ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({reviews})</span>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <button
          onClick={handleBuyNow}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

const ProductSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/bot");
        setProducts(response.data.data.bots || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <MarketToolsSection />
      <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-100">
        {products.map((product) => (
          <ProductCard 
            key={product._id}
            image={product.fileUrl}
            title={product.name}
            rating={4}
            reviews={16}
            description={product.description}
            id={product._id}
          />
        ))}
      </div>
      <GrowBusinessSection />
      <Footer />
    </>
  );
};

export default ProductSection;
