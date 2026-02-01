'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface OfficerData {
    id: number;
    email: string;
    name: string;
    department_code: string;
    department_name: string;
}

export default function OfficerDashboard() {
    const router = useRouter();
    const [officer, setOfficer] = useState<OfficerData | null>(null);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [resolutionText, setResolutionText] = useState('');
    const [showResolutionModal, setShowResolutionModal] = useState(false);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('officer_token');
        const officerData = localStorage.getItem('officer_data');

        if (!token || !officerData) {
            router.push('/officer/login');
            return;
        }

        const parsedOfficer = JSON.parse(officerData);
        setOfficer(parsedOfficer);
        fetchDepartmentComplaints(parsedOfficer.department_code);
    }, [router]);

    const fetchDepartmentComplaints = async (departmentCode: string) => {
        try {
            // Fetch complaints filtered by department
            const response = await axios.get(`${API_URL}/api/complaints`);

            // Filter by department - we'll need to match department_code from officer_auth to department in complaints
            const allComplaints = response.data.complaints || [];
            const filtered = allComplaints.filter((c: any) =>
                c.department_code === departmentCode &&
                (c.status === 'assigned' || c.status === 'in_progress' || c.status === 'pending')
            );

            setComplaints(filtered);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        }
    };

    const loadAISuggestions = async (complaintId: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/resolution/suggestions/${complaintId}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Failed to load AI suggestions:', error);
            setSuggestions(null);
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintClick = (complaint: any) => {
        setSelectedComplaint(complaint);
        loadAISuggestions(complaint.id);
    };

    const handleResolve = async () => {
        if (!selectedComplaint || !resolutionText.trim()) {
            alert('Please enter resolution details');
            return;
        }

        try {
            const token = localStorage.getItem('officer_token');
            await axios.post(
                `${API_URL}/api/complaints/${selectedComplaint.complaint_id}/resolve`,
                {
                    resolution_text: resolutionText,
                    officer_id: officer?.id,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            alert('Complaint resolved successfully!');
            setSelectedComplaint(null);
            setSuggestions(null);
            setResolutionText('');
            setShowResolutionModal(false);
            fetchDepartmentComplaints(officer!.department_code);
        } catch (error: any) {
            alert('Failed to resolve: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('officer_token');
        localStorage.removeItem('officer_data');
        router.push('/officer/login');
    };

    if (!officer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-2xl text-gray-700">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Government Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="tricolor-header"></div>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="gov-emblem">🇮🇳</div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Ministry of Civic Governance</h1>
                                <p className="text-sm text-gray-600">Officer Dashboard - {officer.department_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, <strong>{officer.name}</strong></span>
                            <button onClick={handleLogout} className="gov-btn-secondary text-sm py-2 px-4">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="gov-card p-4 text-center">
                            <p className="text-3xl font-bold text-primary-400">{complaints.length}</p>
                            <p className="text-gray-600 text-sm">Department Complaints</p>
                        </div>
                        <div className="gov-card p-4 text-center">
                            <p className="text-3xl font-bold text-green-400">
                                {complaints.filter(c => c.status === 'assigned').length}
                            </p>
                            <p className="text-gray-600 text-sm">Assigned to You</p>
                        </div>
                        <div className="gov-card p-4 text-center">
                            <p className="text-3xl font-bold text-yellow-400">
                                {complaints.filter(c => c.status === 'pending').length}
                            </p>
                            <p className="text-gray-600 text-sm">Pending Assignment</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Complaints List */}
                        <div className="lg:col-span-1">
                            <div className="gov-card p-6">
                                <h2 className="text-xl font-bold mb-4">Department Complaints ({complaints.length})</h2>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {complaints.map((complaint) => (
                                        <div
                                            key={complaint.id}
                                            onClick={() => handleComplaintClick(complaint)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedComplaint?.id === complaint.id
                                                ? 'bg-primary-500/20 border-primary-500'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-sm">{complaint.complaint_id}</p>
                                                <span className={`text-xs px-2 py-1 rounded ${complaint.status === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                                                    complaint.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {complaint.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm line-clamp-2">{complaint.title}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs">
                                                <span className="text-gray-500">{complaint.category_name}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {complaints.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            <div className="text-4xl mb-2">🎉</div>
                                            <p>No pending complaints in your department!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Complaint Details & AI Suggestions */}
                        <div className="lg:col-span-2">
                            {!selectedComplaint ? (
                                <div className="gov-card p-12 text-center h-full flex items-center justify-center">
                                    <div>
                                        <div className="text-6xl mb-4">👈</div>
                                        <p className="text-gray-600 text-lg">Select a complaint to view AI-powered suggestions</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Complaint Details */}
                                    <div className="gov-card p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">{selectedComplaint.title}</h2>
                                                <p className="text-gray-600 text-sm">ID: {selectedComplaint.complaint_id}</p>
                                            </div>
                                            <button
                                                onClick={() => setShowResolutionModal(true)}
                                                className="btn-primary"
                                            >
                                                ✓ Mark Resolved
                                            </button>
                                        </div>

                                        <p className="text-gray-700 mb-4">{selectedComplaint.description}</p>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                                <p className="font-medium text-sm">{selectedComplaint.category_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Submitted</p>
                                                <p className="font-medium text-sm">{new Date(selectedComplaint.created_at).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">SLA Deadline</p>
                                                <p className="font-medium text-sm">{selectedComplaint.sla_deadline ? new Date(selectedComplaint.sla_deadline).toLocaleString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resolution Modal */}
                                    {showResolutionModal && (
                                        <div className="gov-card p-6 border-2 border-primary-500">
                                            <h3 className="text-xl font-bold mb-4">Enter Resolution Details</h3>
                                            <textarea
                                                className="input-field mb-4"
                                                rows={5}
                                                placeholder="Describe the actions taken to resolve this complaint..."
                                                value={resolutionText}
                                                onChange={(e) => setResolutionText(e.target.value)}
                                            />
                                            <div className="flex gap-3">
                                                <button onClick={handleResolve} className="btn-primary flex-1">
                                                    Submit Resolution
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowResolutionModal(false);
                                                        setResolutionText('');
                                                    }}
                                                    className="btn-primary bg-gray-500/20 border-gray-500 flex-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* AI-POWERED SUGGESTIONS */}
                                    {loading ? (
                                        <div className="gov-card p-12 text-center">
                                            <div className="animate-pulse-slow text-4xl mb-4">🤖</div>
                                            <p className="text-gray-600">AI is analyzing similar cases...</p>
                                        </div>
                                    ) : suggestions && suggestions.similar_complaints?.length > 0 ? (
                                        <div className="gov-card p-6 border-2 border-primary-500/30">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-xl">🤖</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-primary-400">AI Resolution Suggestions</h3>
                                                    <p className="text-sm text-gray-600">Based on {suggestions.similar_complaints.length} similar resolved cases</p>
                                                </div>
                                            </div>

                                            {/* Suggested Actions */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-3 text-green-400">✓ Recommended Actions:</h4>
                                                <div className="space-y-2">
                                                    {suggestions.suggestions?.suggested_actions?.map((action: string, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                                            <span className="text-green-400 font-bold">{idx + 1}.</span>
                                                            <p className="text-gray-900">{action}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Estimated Time */}
                                            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Est. Resolution Time</p>
                                                    <p className="font-bold text-lg text-primary-400">{suggestions.suggestions?.estimated_time_hours}h</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Success Probability</p>
                                                    <p className="font-bold text-lg text-green-400">{(suggestions.suggestions?.success_probability * 100).toFixed(0)}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Based on Cases</p>
                                                    <p className="font-bold text-lg text-blue-400">{suggestions.suggestions?.based_on_cases}</p>
                                                </div>
                                            </div>

                                            {/* Similar Cases */}
                                            <div>
                                                <h4 className="font-semibold mb-3 text-blue-400">🔍 Similar Resolved Cases:</h4>
                                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                                    {suggestions.similar_complaints.map((similar: any, idx: number) => (
                                                        <div key={idx} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-sm">{similar.complaint_id}</p>
                                                                <span className="text-xs text-green-400">✓ Resolved in {Math.round(similar.time_to_resolve_hours)}h</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 mb-2">{similar.title}</p>
                                                            <div className="p-2 bg-white/5 rounded text-xs text-gray-600">
                                                                <strong>Resolution:</strong> {similar.resolution_text}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="gov-card p-8 text-center">
                                            <div className="text-4xl mb-2">💡</div>
                                            <p className="text-gray-600">No similar cases found yet. You'll be setting the precedent!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
