import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../config';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on new product load
        setLoading(true);

        // Fetch Product Details
        fetch(`${API_BASE_URL}/products`) // Ideally strictly fetch one, but list is okay for small scale
            .then(res => res.json())
            .then(data => {
                const found = data.find(p => p._id === id);
                setProduct(found);
                // Simple random related products
                const others = data.filter(p => p._id !== id).sort(() => 0.5 - Math.random()).slice(0, 3);
                setRelated(others);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            alert("Please login to purchase items!");
            navigate('/');
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, productId: product._id, quantity: 1 })
            });

            if (res.ok) {
                const confirmed = window.confirm(`${product.name} added to cart! Go to Cart?`);
                if (confirmed) {
                    navigate('/cart', { state: { user } }); // Pass user state
                }
            } else {
                alert("Failed to add to cart");
            }
        } catch (err) {
            console.log(err);
            alert("Error adding to cart");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-500 animate-pulse">Loading amazing gift...</div>;
    if (!product) return <div className="p-10 text-center">Product Not Found</div>;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar user={user} />

            {/* Breadcrumb / Back */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-pink-600 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">

                    {/* Image Section */}
                    <div className="relative group">
                        <div className="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-center object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pink-600">
                            {product.category || 'Gift'}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
                            </div>
                            <span className="text-sm text-gray-500">128 Reviews</span>
                        </div>

                        <div className="mt-6">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900 font-medium">${product.price}</p>
                        </div>

                        <div className="mt-8">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-base text-gray-500 space-y-6 leading-relaxed">
                                <p>{product.description}</p>
                                <p>Perfect for birthdays, anniversaries, or just to show you care. beautifully packaged and ready to gift.</p>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button
                                onClick={handlePurchase}
                                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-xl shadow-pink-200 transition-all hover:-translate-y-1"
                            >
                                <ShoppingBag className="w-6 h-6 mr-2" />
                                Add to Cart
                            </button>
                            <button className="flex-none bg-gray-100 rounded-full p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                                <Star className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="mt-12 border-t border-gray-100 pt-10">
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                                <div className="flex flex-col items-center text-center">
                                    <Truck className="w-8 h-8 text-blue-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">Swift Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">Quality Guarantee</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <RefreshCw className="w-8 h-8 text-purple-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-24 border-t border-gray-100 pt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also love</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {related.map(item => (
                            <div key={item._id} onClick={() => navigate(`/product/${item._id}`, { state: { user } })} className="cursor-pointer group">
                                <div className="aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                    <img src={item.image} alt={item.name} className="object-cover w-full h-64 group-hover:scale-105 transition duration-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition">{item.name}</h3>
                                <p className="text-gray-500">${item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
