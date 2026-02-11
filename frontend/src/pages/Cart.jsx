import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user; // In a real app, use Context or Redux
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchCart = () => {
            fetch(`${API_BASE_URL}/cart/list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user })
            })
                .then(res => res.json())
                .then(data => {
                    setCartItems(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        };

        fetchCart();
    }, [user, navigate]);

    const handleRemove = async (productId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/cart/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, productId })
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setCartItems(updatedCart);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/cart/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user })
            });
            if (res.ok) {
                alert("Thank you for your purchase! Your gifts are on the way.");
                setCartItems([]);
            }
        } catch (err) {
            console.error(err);
            alert("Checkout failed");
        }
    };

    const total = cartItems.reduce((acc, item) => acc + (item.productId?.price * item.quantity), 0);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

                {loading ? (
                    <div className="text-center py-20">Loading cart...</div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't found the perfect gift yet.</p>
                        <button onClick={() => navigate('/home', { state: { user } })} className="text-pink-600 font-bold hover:underline">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        <div className="lg:col-span-8">
                            <ul className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                                {cartItems.map((item) => (
                                    item.productId && (
                                        <li key={item._id} className="p-6 flex items-center">
                                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-xl overflow-hidden">
                                                <img
                                                    src={item.productId.image}
                                                    alt={item.productId.name}
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>

                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.productId.name}</h3>
                                                        <p className="ml-4">${item.productId.price}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.productId.category}</p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemove(item.productId._id)}
                                                            className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={16} /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sticky top-24">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                                <div className="flow-root">
                                    <dl className="-my-4 text-sm divide-y divide-gray-100">
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">Subtotal</dt>
                                            <dd className="font-medium text-gray-900">${total.toFixed(2)}</dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">Shipping</dt>
                                            <dd className="font-medium text-green-600">Free</dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between border-t border-gray-100">
                                            <dt className="text-base font-bold text-gray-900">Order Total</dt>
                                            <dd className="text-base font-bold text-gray-900">${total.toFixed(2)}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-gray-900 border border-transparent rounded-full shadow-sm py-4 px-4 text-base font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all flex items-center justify-center gap-2"
                                    >
                                        Checkout <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
