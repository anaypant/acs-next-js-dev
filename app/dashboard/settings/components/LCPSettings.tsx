"use client";

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Zap, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LCPSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function LCPSettings({ userData, onSave }: LCPSettingsProps) {
    const [form, setForm] = useState({ 
        autoResponse: true,
        responseDelay: 5,
        maxConcurrentConversations: 10,
        enableNotifications: true,
        notificationFrequency: 'immediate',
        enableAutoFollowUp: true,
        followUpDelay: 24,
        enableSpamFilter: true,
        spamSensitivity: 'medium'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData) {
            setForm({
                autoResponse: userData.autoResponse !== false,
                responseDelay: userData.responseDelay || 5,
                maxConcurrentConversations: userData.maxConcurrentConversations || 10,
                enableNotifications: userData.enableNotifications !== false,
                notificationFrequency: userData.notificationFrequency || 'immediate',
                enableAutoFollowUp: userData.enableAutoFollowUp !== false,
                followUpDelay: userData.followUpDelay || 24,
                enableSpamFilter: userData.enableSpamFilter !== false,
                spamSensitivity: userData.spamSensitivity || 'medium'
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm({ 
            ...form, 
            [name]: type === 'checkbox' ? checked : 
                    type === 'number' ? parseInt(value) : value 
        });
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
                setError(result.error || 'Failed to update LCP settings.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="lcp-settings" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    LCP (Lead Conversation Platform) Settings
                </h2>
                <p className="text-sm text-green-100 mt-1">Configure your automated conversation and response settings</p>
            </div>
            
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Auto Response Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#0e6537]" />
                            Auto Response Settings
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="autoResponse" 
                                        checked={form.autoResponse} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Enable Auto Response</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-7">Automatically respond to new leads</p>
                            </div>
                            
                            <div>
                                <label htmlFor="responseDelay" className="block text-sm font-medium text-gray-700 mb-2">
                                    Response Delay (minutes)
                                </label>
                                <input 
                                    type="number" 
                                    name="responseDelay" 
                                    id="responseDelay" 
                                    value={form.responseDelay} 
                                    onChange={handleChange}
                                    min="1"
                                    max="60"
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900 placeholder-gray-500",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conversation Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#0e6537]" />
                            Conversation Management
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="maxConcurrentConversations" className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Concurrent Conversations
                                </label>
                                <input 
                                    type="number" 
                                    name="maxConcurrentConversations" 
                                    id="maxConcurrentConversations" 
                                    value={form.maxConcurrentConversations} 
                                    onChange={handleChange}
                                    min="1"
                                    max="50"
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900 placeholder-gray-500",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="notificationFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                                    Notification Frequency
                                </label>
                                <select 
                                    name="notificationFrequency" 
                                    id="notificationFrequency" 
                                    value={form.notificationFrequency} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                >
                                    <option value="immediate">Immediate</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Follow-up Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#0e6537]" />
                            Follow-up Settings
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="enableAutoFollowUp" 
                                        checked={form.enableAutoFollowUp} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Enable Auto Follow-up</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-7">Automatically follow up with leads</p>
                            </div>
                            
                            <div>
                                <label htmlFor="followUpDelay" className="block text-sm font-medium text-gray-700 mb-2">
                                    Follow-up Delay (hours)
                                </label>
                                <input 
                                    type="number" 
                                    name="followUpDelay" 
                                    id="followUpDelay" 
                                    value={form.followUpDelay} 
                                    onChange={handleChange}
                                    min="1"
                                    max="168"
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900 placeholder-gray-500",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Spam Filter Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#0e6537]" />
                            Spam Filter Settings
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="enableSpamFilter" 
                                        checked={form.enableSpamFilter} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Enable Spam Filter</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-7">Filter out spam and unwanted messages</p>
                            </div>
                            
                            <div>
                                <label htmlFor="spamSensitivity" className="block text-sm font-medium text-gray-700 mb-2">
                                    Spam Sensitivity
                                </label>
                                <select 
                                    name="spamSensitivity" 
                                    id="spamSensitivity" 
                                    value={form.spamSensitivity} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                >
                                    <option value="low">Low (Fewer false positives)</option>
                                    <option value="medium">Medium (Balanced)</option>
                                    <option value="high">High (More aggressive)</option>
                                </select>
                            </div>
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
                            <p className="text-sm text-green-700">LCP settings updated successfully!</p>
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
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
} 