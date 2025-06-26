"use client";

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Palette, Bell, Globe, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreferencesSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function PreferencesSettings({ userData, onSave }: PreferencesSettingsProps) {
    const [form, setForm] = useState({ 
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        autoSave: true,
        compactMode: false,
        showTutorials: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData) {
            setForm({
                theme: userData.theme || 'light',
                language: userData.language || 'en',
                timezone: userData.timezone || 'UTC',
                dateFormat: userData.dateFormat || 'MM/DD/YYYY',
                timeFormat: userData.timeFormat || '12h',
                emailNotifications: userData.emailNotifications !== false,
                pushNotifications: userData.pushNotifications !== false,
                smsNotifications: userData.smsNotifications === true,
                autoSave: userData.autoSave !== false,
                compactMode: userData.compactMode === true,
                showTutorials: userData.showTutorials !== false
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm({ 
            ...form, 
            [name]: type === 'checkbox' ? checked : value 
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
                setError(result.error || 'Failed to update preferences.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="preferences" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    Preferences & Display
                </h2>
                <p className="text-sm text-green-100 mt-1">Customize your interface and notification preferences</p>
            </div>
            
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Appearance Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-[#0e6537]" />
                            Appearance
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                                    Theme
                                </label>
                                <select 
                                    name="theme" 
                                    id="theme" 
                                    value={form.theme} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                >
                                    <option value="light">Light Theme</option>
                                    <option value="dark">Dark Theme</option>
                                    <option value="auto">Auto (System)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="compactMode" 
                                        checked={form.compactMode} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-7">Reduce spacing for more content</p>
                            </div>
                        </div>
                    </div>

                    {/* Localization Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-[#0e6537]" />
                            Localization
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <select 
                                    name="language" 
                                    id="language" 
                                    value={form.language} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="it">Italiano</option>
                                    <option value="pt">Português</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone
                                </label>
                                <select 
                                    name="timezone" 
                                    id="timezone" 
                                    value={form.timezone} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date Format
                                </label>
                                <select 
                                    name="dateFormat" 
                                    id="dateFormat" 
                                    value={form.dateFormat} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[#0e6537]" />
                            Notifications
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="emailNotifications" 
                                        checked={form.emailNotifications} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="pushNotifications" 
                                        checked={form.pushNotifications} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="smsNotifications" 
                                        checked={form.smsNotifications} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                                </label>
                            </div>
                            
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="autoSave" 
                                        checked={form.autoSave} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Auto Save</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="showTutorials" 
                                        checked={form.showTutorials} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Show Tutorials</span>
                                </label>
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
                            <p className="text-sm text-green-700">Preferences updated successfully!</p>
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
                                    Save Preferences
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
} 