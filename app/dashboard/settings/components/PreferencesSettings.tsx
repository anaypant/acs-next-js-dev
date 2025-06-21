"use client";

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

interface PreferencesSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function PreferencesSettings({ userData, onSave }: PreferencesSettingsProps) {
    const [form, setForm] = useState({
        timezone: 'America/New_York',
        language: 'en',
        theme: 'system',
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: false,
        data_sharing: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData) {
            setForm({
                timezone: userData.timezone || 'America/New_York',
                language: userData.language || 'en',
                theme: userData.theme || 'system',
                email_notifications: userData.email_notifications !== 'false',
                sms_notifications: userData.sms_notifications === 'true',
                marketing_emails: userData.marketing_emails === 'true',
                data_sharing: userData.data_sharing === 'true',
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await onSave({
            ...form,
            email_notifications: form.email_notifications ? 'true' : 'false',
            sms_notifications: form.sms_notifications ? 'true' : 'false',
            marketing_emails: form.marketing_emails ? 'true' : 'false',
            data_sharing: form.data_sharing ? 'true' : 'false',
        });

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to update preferences.');
        }
        setLoading(false);
    };

    return (
        <section id="preferences">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Settings /> Preferences</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                            <select name="timezone" id="timezone" value={form.timezone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option>America/New_York</option>
                                <option>America/Chicago</option>
                                <option>America/Denver</option>
                                <option>America/Los_Angeles</option>
                                <option>Europe/London</option>
                                <option>Europe/Paris</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                            <select name="language" id="language" value={form.language} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                            <select name="theme" id="theme" value={form.theme} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <div className="flex items-center">
                            <input id="email_notifications" name="email_notifications" type="checkbox" checked={form.email_notifications} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-900">Email Notifications</label>
                        </div>
                        <div className="flex items-center">
                            <input id="sms_notifications" name="sms_notifications" type="checkbox" checked={form.sms_notifications} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="sms_notifications" className="ml-2 block text-sm text-gray-900">SMS Notifications</label>
                        </div>
                        <div className="flex items-center">
                            <input id="marketing_emails" name="marketing_emails" type="checkbox" checked={form.marketing_emails} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="marketing_emails" className="ml-2 block text-sm text-gray-900">Marketing Emails</label>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">Data Privacy</h3>
                        <div className="flex items-center">
                            <input id="data_sharing" name="data_sharing" type="checkbox" checked={form.data_sharing} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="data_sharing" className="ml-2 block text-sm text-gray-900">Allow data sharing for product improvement</label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-sm text-green-600 mt-2">Preferences updated successfully!</p>}
                </form>
            </div>
        </section>
    );
} 