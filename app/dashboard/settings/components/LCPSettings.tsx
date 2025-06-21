"use client";

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

interface LCPSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function LCPSettings({ userData, onSave }: LCPSettingsProps) {
    const [form, setForm] = useState({
        lcp_tone: 'professional',
        lcp_style: 'concise',
        lcp_sample_prompt: '',
        lcp_automatic_enabled: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData) {
            setForm({
                lcp_tone: userData.lcp_tone || 'professional',
                lcp_style: userData.lcp_style || 'concise',
                lcp_sample_prompt: userData.lcp_sample_prompt || '',
                lcp_automatic_enabled: userData.lcp_automatic_enabled === 'true',
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            lcp_automatic_enabled: form.lcp_automatic_enabled ? 'true' : 'false'
        });

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to update LCP settings.');
        }
        setLoading(false);
    };

    return (
        <section id="lcp-settings">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Bot /> LCP AI Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lcp_tone" className="block text-sm font-medium text-gray-700">Tone</label>
                            <select name="lcp_tone" id="lcp_tone" value={form.lcp_tone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option>Professional</option>
                                <option>Casual</option>
                                <option>Enthusiastic</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="lcp_style" className="block text-sm font-medium text-gray-700">Style</label>
                            <select name="lcp_style" id="lcp_style" value={form.lcp_style} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option>Concise</option>
                                <option>Detailed</option>
                                <option>Formal</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lcp_sample_prompt" className="block text-sm font-medium text-gray-700">Sample Prompt</label>
                        <textarea name="lcp_sample_prompt" id="lcp_sample_prompt" value={form.lcp_sample_prompt} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., 'Draft a follow-up email to a new lead...'" />
                    </div>
                    <div className="flex items-center">
                        <input id="lcp_automatic_enabled" name="lcp_automatic_enabled" type="checkbox" checked={form.lcp_automatic_enabled} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor="lcp_automatic_enabled" className="ml-2 block text-sm text-gray-900">Enable Automated Emailing</label>
                    </div>
                    <div className="mt-4">
                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save LCP Settings'}
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-sm text-green-600 mt-2">LCP settings updated successfully!</p>}
                </form>
            </div>
        </section>
    );
} 