'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <>
            {/* Government Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="tricolor-header"></div>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="gov-emblem">🇮🇳</div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Ministry of Civic Governance</h1>
                                <p className="text-sm text-gray-600">Government of India</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                            <span>Screen Reader Access</span>
                            <span>|</span>
                            <span>हिंदी</span>
                            <span>|</span>
                            <span>Skip to main content</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-5xl w-full">
                    {/* Hero Section */}
                    <div className="text-center mb-16 fade-in">
                        <div className="inline-block mb-6">
                            <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center shadow-xl text-4xl">
                                ⚖️
                            </div>
                        </div>

                        <h1 className="text-5xl font-bold mb-4 text-gray-900">
                            PulseGov
                        </h1>
                        <p className="text-xl text-blue-800 mb-2 font-medium">Civic Complaint Management System</p>
                        <p className="text-lg text-gray-600 mb-2">Ministry of Civic Governance</p>
                        <p className="text-base text-gray-500 max-w-2xl mx-auto mb-4">
                            Official platform for citizens to submit and track civic complaints. Powered by AI for efficient resolution.
                        </p>
                        <p className="text-sm text-blue-600 font-semibold">Government of India Initiative</p>
                    </div>

                    {/* Portal Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Citizen Portal */}
                        <Link href="/citizen" className="gov-card p-8 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-700 transition-colors">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-center text-gray-900">Citizen Portal</h3>
                            <p className="text-gray-600 text-center mb-3">Submit and track complaints</p>
                            <div className="text-blue-600 text-center text-sm font-semibold">Access Portal →</div>
                        </Link>

                        {/* Officer Dashboard */}
                        <Link href="/officer" className="gov-card p-8 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-green-700 transition-colors">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-center text-gray-900">Officer Dashboard</h3>
                            <p className="text-gray-600 text-center mb-3">AI-powered resolution intelligence</p>
                            <div className="text-green-600 text-center text-sm font-semibold">Access Dashboard →</div>
                        </Link>

                        {/* Admin Dashboard */}
                        <Link href="/admin" className="gov-card p-8 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-700 transition-colors">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-center text-gray-900">Admin Dashboard</h3>
                            <p className="text-gray-600 text-center mb-3">Analytics and performance metrics</p>
                            <div className="text-purple-600 text-center text-sm font-semibold">Access Dashboard →</div>
                        </Link>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-16 grid md:grid-cols-4 gap-6 text-center">
                        <div className="p-4">
                            <div className="text-4xl mb-2">🤖</div>
                            <h4 className="font-bold mb-1 text-gray-900">AI Classification</h4>
                            <p className="text-sm text-gray-600">Auto-categorize complaints with 95% accuracy</p>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl mb-2">⚡</div>
                            <h4 className="font-bold mb-1 text-gray-900">Smart Routing</h4>
                            <p className="text-sm text-gray-600">Assign to best officer based on workload & expertise</p>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl mb-2">🎯</div>
                            <h4 className="font-bold mb-1 text-gray-900">Predictive SLA</h4>
                            <p className="text-sm text-gray-600">Forecast breaches before they happen</p>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl mb-2">🔗</div>
                            <h4 className="font-bold mb-1 text-gray-900">Blockchain Audit</h4>
                            <p className="text-sm text-gray-600">Immutable transparency for all actions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Government Footer */}
            <footer className="gov-footer mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-bold mb-4">Ministry of Civic Governance</h3>
                            <p className="text-gray-400 text-sm">Government of India</p>
                            <p className="text-gray-400 text-sm">Digital India Initiative</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Help</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Services</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white">File Complaint</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Track Status</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Officer Portal</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Connect</h4>
                            <p className="text-gray-400 text-sm mb-2">Follow us on social media</p>
                            <div className="flex space-x-4 text-2xl">
                                <span>📘</span>
                                <span>🐦</span>
                                <span>📺</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2026 Ministry of Civic Governance, Government of India. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            This is an official website of the Government of India
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
