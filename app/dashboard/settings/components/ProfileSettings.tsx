"use client";

import { useState, useEffect } from 'react';
import { User, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function ProfileSettings({ userData, onSave }: ProfileSettingsProps) {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData) {
            setForm({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || ''
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await onSave(form);

            if (result.success) {
                setSuccess(true);
                // Auto-hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || 'Failed to update profile.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="profile" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <User className="w-5 h-5" />
                    Profile Settings
                </h2>
                <p className="text-sm text-green-100 mt-1">Manage your personal information and contact details</p>
            </div>
            
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={form.name} 
                                onChange={handleChange}
                                className={cn(
                                    "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                    "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                    "text-gray-900 placeholder-gray-500",
                                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                )}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={form.email} 
                                onChange={handleChange}
                                className={cn(
                                    "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                    "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                    "text-gray-900 placeholder-gray-500",
                                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                )}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input 
                                type="tel" 
                                name="phone" 
                                id="phone" 
                                value={form.phone} 
                                onChange={handleChange}
                                className={cn(
                                    "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                    "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                    "text-gray-900 placeholder-gray-500",
                                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                )}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>
                    
                    {/* Status Messages */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-sm text-green-700">Profile updated successfully!</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                                loading 
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white hover:from-[#0e6537] hover:to-[#157a42] focus:ring-[#0e6537]/50 shadow-lg hover:shadow-xl"
                            )}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
} 