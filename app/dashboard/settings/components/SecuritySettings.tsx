"use client";

import { useState } from 'react';
import { Shield } from 'lucide-react';

interface SecuritySettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function SecuritySettings({ userData, onSave }: SecuritySettingsProps) {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match.");
            setLoading(false);
            return;
        }

        if (form.newPassword && form.newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            setLoading(false);
            return;
        }
        
        const updateData: any = {};
        if (form.newPassword) {
            updateData.password = form.newPassword;
        }

        const result = await onSave(updateData);

        if (result.success) {
            setSuccess(true);
            setForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                twoFactorEnabled: form.twoFactorEnabled,
            });
        } else {
            setError(result.error || 'Failed to update security settings.');
        }
        setLoading(false);
    };

    return (
        <section id="security">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Shield /> Security</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" name="currentPassword" id="currentPassword" value={form.currentPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" name="newPassword" id="newPassword" value={form.newPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div className="flex items-center">
                        <input id="twoFactorEnabled" name="twoFactorEnabled" type="checkbox" checked={form.twoFactorEnabled} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-900">Enable Two-Factor Authentication (coming soon)</label>
                    </div>
                    <div className="mt-4">
                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Update Security'}
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-sm text-green-600 mt-2">Security settings updated successfully!</p>}
                </form>
            </div>
        </section>
    );
} 