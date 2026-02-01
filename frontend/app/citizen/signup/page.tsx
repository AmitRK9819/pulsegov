'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CitizenSignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(formData.username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/auth/citizen/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            alert(`✅ Account created successfully!\n\nWelcome, ${formData.username}!`);
            router.push('/citizen/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
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
                            Create Citizen Account
                        </h1>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="gov-input"
                                    placeholder="Choose a unique username"
                                />
                                <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="gov-input"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Password *</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="gov-input"
                                    placeholder="Create a strong password"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password *</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="gov-input"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="gov-btn-primary w-full mt-6"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm mb-2">Already have an account?</p>
                            <Link href="/citizen/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Login
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
