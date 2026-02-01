'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CitizenLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Username and password are required');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/auth/citizen/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and citizen data
            localStorage.setItem('citizenToken', data.token);
            localStorage.setItem('citizenData', JSON.stringify(data.citizen));

            alert(`✅ Welcome back, ${data.citizen.username}!`);
            router.push('/citizen');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Government Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="tricolor-header"></div>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="gov-emblem">🇮🇳</div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Ministry of Civic Governance</h1>
                            <p className="text-sm text-gray-600">Government of India</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full fade-in">
                    <div className="gov-card p-8">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                            Citizen Login
                        </h1>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="gov-input"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="gov-input"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="gov-btn-primary w-full mt-6"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm mb-2">Don't have an account?</p>
                            <Link href="/citizen/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Create New Account
                            </Link>
                        </div>

                        <div className="mt-4 text-center">
                            <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
