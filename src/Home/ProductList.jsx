import React, { useState } from 'react';
import MarketToolSection from './MarketToolSection';
import GrowBusinessSection from './GrowBusinessSection';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    title: 'HeikenAshi EA',
    description:
      'The 2 Moving Average Cross Strategy is a trend-following approach designed to identify potential entry and exit points in the financial markets',
    price: 9.99,
    rating: 4.5,
    reviews: 16,
    image: 'https://via.placeholder.com/300',
    tag: 'Expert Adviser',
    platform: 'MT4/MT5',
  },
  {
    id: 2,
    title: 'Advanced EA',
    description: 'An advanced trading strategy with customizable features for optimal trading.',
    price: 19.99,
    rating: 4.8,
    reviews: 24,
    image: 'https://via.placeholder.com/300',
    tag: 'Expert Adviser',
    platform: 'MT4/MT5',
  },
  {
    id: 3,
    title: 'Scalping EA',
    description: 'A scalping strategy for high-frequency traders in volatile markets.',
    price: 14.99,
    rating: 4.3,
    reviews: 10,
    image: 'https://via.placeholder.com/300',
    tag: 'Expert Adviser',
    platform: 'MT4/MT5',
  },
];

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xs">
    <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <span className="text-sm text-blue-600 font-semibold">{product.tag}</span>
      <h3 className="text-lg font-bold mt-2">{product.title}</h3>
      <p className="text-gray-600 text-sm mt-2">{product.description}</p>
      <div className="flex items-center mt-4">
        <div className="flex items-center text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${i < Math.round(product.rating) ? '' : 'text-gray-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927a1 1 0 011.902 0l1.286 4.169a1 1 0 00.95.69h4.388a1 1 0 01.592 1.806l-3.555 2.58a1 1 0 00-.364 1.118l1.287 4.169a1 1 0 01-1.538 1.118L10 14.347l-3.555 2.58a1 1 0 01-1.538-1.118l1.287-4.169a1 1 0 00-.364-1.118L2.275 9.592a1 1 0 01.592-1.806h4.388a1 1 0 00.95-.69L9.049 2.927z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-blue-600 font-semibold">${product.price.toFixed(2)}</span>
        <button className="ml-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-full flex items-center hover:bg-blue-700">
          Buy Now
        </button>
      </div>
    </div>
  </div>
);

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const productsPerPage = 3;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset pagination after search
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const filteredProducts = products
    .filter((product) => product.title.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="bg-gray-50 min-h-screen p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold text-blue-900">NemalaFX</div>
          <nav className="flex space-x-6 items-center">
  <Link  to={"/ProductSection"} className="text-secondary hover:text-secondary-dark transition-colors duration-200">Home</Link>
  <Link  to={""}className="text-secondary hover:text-secondary-dark transition-colors duration-200">Products</Link>
  <Link to={""} className="text-secondary hover:text-secondary-dark transition-colors duration-200">Strategies</Link>
  <Link  to={""} className="text-secondary hover:text-secondary-dark transition-colors duration-200">Services</Link>
  <Link  to={""} className="text-secondary hover:text-secondary-dark transition-colors duration-200">School</Link>
  <Link  to={""} className="text-secondary hover:text-secondary-dark transition-colors duration-200">About Us</Link>
</nav>

          <div className="space-x-4">
            <button className="text-blue-700">Log In</button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-md">Sign Up</button>
          </div>
        </header>

        <MarketToolSection />

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          />
          <select
            value={sortBy}
            onChange={handleSort}
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          >
            <option value="">Sort by</option>
            <option value="price">Price (Low to High)</option>
            <option value="rating">Rating (High to Low)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-5 py-2 mx-2 rounded-full ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <GrowBusinessSection />
      <Footer />
    </div>
  );
};

export default ProductList;
