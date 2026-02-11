import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu } from 'lucide-react';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear session (if you use localStorage later)
        navigate('/home'); // Redirect to Login page
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">U</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                            Unbox You
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#shop" className="text-gray-600 hover:text-pink-600 font-medium transition">Shop</a>
                        <a href="#about" className="text-gray-600 hover:text-pink-600 font-medium transition">About</a>

                        {/* Dynamic User Section */}
                        <div className="flex items-center gap-4 ml-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
                                        <User size={18} className="text-pink-600" />
                                        <span className="text-sm font-semibold text-pink-700">
                                            {user.fullname.split(' ')[0]} {/* Show first name */}
                                        </span>
                                    </div>

                                    {user.role === 'admin' && (
                                        <button
                                            onClick={() => navigate('/admin', { state: { user } })}
                                            className="text-sm font-medium text-purple-600 hover:text-purple-800 underline">
                                            Dashboard
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                        title="Logout">
                                        <LogOut size={20} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/">
                                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        Login
                                    </button>
                                </Link>
                            )}

                            <button onClick={() => navigate('/cart', { state: { user } })} className="relative p-2 text-gray-600 hover:text-pink-600 transition">
                                <ShoppingBag size={24} />
                                <span className="absolute top-0 right-0 h-4 w-4 bg-pink-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
                                    {user?.cart?.length || 0}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;