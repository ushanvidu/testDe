import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', image: ''
    });

    // Security Redirect
    if (!user || user.role !== 'admin') {
        return <div className="p-10 text-red-600">Access Denied</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/products/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: user, // Passed for Logging
                    productData: formData
                })
            });
            if (res.ok) {
                alert("Product Added & Action Logged!");
                setFormData({ name: '', description: '', price: '', image: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <button onClick={() => navigate('/home', { state: { user } })} className="mb-4 text-blue-600 underline">
                &larr; Back to Shop
            </button>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-6">Admin: Add New Inventory</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Product Name" className="w-full p-2 border rounded"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Description" className="w-full p-2 border rounded"
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Price" className="w-full p-2 border rounded"
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Image URL (e.g., https://unsplash.com/...)" className="w-full p-2 border rounded"
                        value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                    <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800">
                        Add Item & Log Action
                    </button>
                </form>
            </div>
        </div>
    );
}