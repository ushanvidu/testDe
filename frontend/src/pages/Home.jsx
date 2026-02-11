import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Gift, Truck, Star, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar'; // Import the new Navbar
import { API_BASE_URL } from '../config';

export default function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user; // Get logged in user data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Products from Backend
    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* 1. Navbar (Passed user prop to handle login state) */}
            <Navbar user={user} />

            {/* 2. Hero Section */}
            <header className="relative bg-gradient-to-b from-pink-50 via-purple-50 to-white overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-6">
                        🎁 The Perfect Gift Awaits
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
                        Curated Boxes for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                            Unforgettable Moments
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
                        Stop giving boring gifts. We curate experiences that tell a story,
                        packaged beautifully and delivered with love.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#shop" className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-xl hover:-translate-y-1 transform flex items-center gap-2">
                            Start Shopping <ArrowRight size={20} />
                        </a>
                        <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition">
                            How it Works
                        </button>
                    </div>
                </div>
            </header>

            {/* 3. Features Strip */}
            <section className="py-12 border-y border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-4">
                                <Gift size={24} />
                            </div>
                            <h3 className="font-bold text-lg">Curated with Love</h3>
                            <p className="text-gray-500 mt-2">Hand-picked items that match perfectly.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                                <Heart size={24} />
                            </div>
                            <h3 className="font-bold text-lg">Personalized Touch</h3>
                            <p className="text-gray-500 mt-2">Add custom notes and specific preferences.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                <Truck size={24} />
                            </div>
                            <h3 className="font-bold text-lg">Express Delivery</h3>
                            <p className="text-gray-500 mt-2">Same-day shipping for urgent surprises.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Product Grid (Dynamic) */}
            <section id="shop" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending Collections</h2>
                        <p className="text-gray-500 text-lg">Choose the perfect box for your special occasion.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-400 animate-pulse">Loading amazing gifts...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`, { state: { user } })}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                                >
                                    {/* Image Area */}
                                    <div className="relative h-72 overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                            {product.category || 'Gift'}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8">
                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-2">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition">{product.name}</h3>
                                        <p className="text-gray-500 mb-6 line-clamp-2 text-sm leading-relaxed">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</span>
                                                <div className="text-2xl font-bold text-gray-900">${product.price}</div>
                                            </div>
                                            <div className="bg-gray-50 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-400 text-sm">
                <p>&copy; 2025 Unbox You. Created for DevOps Assignment.</p>
            </footer>
        </div>
    );
}