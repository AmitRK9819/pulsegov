'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function OfficerLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/auth/officer/login`, {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                // Store auth data in localStorage
                localStorage.setItem('officer_token', response.data.token);
                localStorage.setItem('officer_data', JSON.stringify(response.data.officer));

                // Redirect to officer dashboard
                router.push('/officer');
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🔐</div>
                    <h1 className="text-3xl font-bold mb-2">Officer Login</h1>
                    <p className="text-white/60">Access your PulseGov dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="officer@gov.in"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    <div className="text-center">
                        <p className="text-white/60 text-sm">
                            Don't have an account?{' '}
                            <a href="/officer/signup" className="text-blue-400 hover:text-blue-300">
                                Register here
                            </a>
                        </p>
                    </div>

                    <div className="text-center pt-3 border-t border-white/10">
                        <a href="/" className="text-white/40 hover:text-white/60 text-sm">
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
