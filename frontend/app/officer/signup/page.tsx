'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Department {
    id: number;
    name: string;
    code: string;
    description: string;
}

export default function OfficerSignup() {
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        department_code: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/departments`);
            if (response.data.success) {
                setDepartments(response.data.departments);
            }
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.department_code) {
            setError('Please select a department');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/auth/officer/register`, {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                department_code: formData.department_code,
            });

            if (response.data.success) {
                alert('Registration successful! Please login.');
                router.push('/officer/login');
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Officer Registration</h1>
                    <p className="text-white/60">Create your PulseGov officer account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="officer@gov.in"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="+91XXXXXXXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Department</label>
                        <select
                            required
                            className="input-field"
                            value={formData.department_code}
                            onChange={(e) => setFormData({ ...formData, department_code: e.target.value })}
                        >
                            <option value="">Select your department</option>
                            {departments.map((dept) => (
                                <option key={dept.code} value={dept.code}>
                                    {dept.name} ({dept.code})
                                </option>
                            ))}
                        </select>
                        {formData.department_code && (
                            <p className="text-xs text-white/40 mt-1">
                                {departments.find(d => d.code === formData.department_code)?.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Minimum 6 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60 text-sm">
                        Already have an account?{' '}
                        <a href="/officer/login" className="text-blue-400 hover:text-blue-300">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
