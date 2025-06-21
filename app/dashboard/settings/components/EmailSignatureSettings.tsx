"use client";

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface EmailSignatureSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function EmailSignatureSettings({ userData, onSave }: EmailSignatureSettingsProps) {
    const [signature, setSignature] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData) {
            setSignature(userData.email_signature || '');
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSignature(e.target.value);
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await onSave({ email_signature: signature });

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to update email signature.');
        }
        setLoading(false);
    };

    return (
        <section id="email-signature">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Mail /> Email Signature</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="signature" className="block text-sm font-medium text-gray-700">Signature</label>
                        <textarea name="signature" id="signature" value={signature} onChange={handleChange} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div className="mt-4">
                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Signature'}
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-sm text-green-600 mt-2">Signature updated successfully!</p>}
                </form>
            </div>
        </section>
    );
} 