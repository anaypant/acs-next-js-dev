"use client";

import { useState, useEffect } from 'react';
import { Mail, Save, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailSignatureSettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function EmailSignatureSettings({ userData, onSave }: EmailSignatureSettingsProps) {
    const [form, setForm] = useState({ 
        emailSignature: '',
        includeLogo: true,
        includeSocialLinks: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (userData) {
            setForm({
                emailSignature: userData.emailSignature || '',
                includeLogo: userData.includeLogo !== false,
                includeSocialLinks: userData.includeSocialLinks !== false
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
                setError(result.error || 'Failed to update email signature.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generatePreviewSignature = () => {
        let signature = form.emailSignature;
        
        if (form.includeLogo) {
            signature = `[ACS Logo]\n${signature}`;
        }
        
        if (form.includeSocialLinks) {
            signature += `\n\n---\nConnect with me:\nLinkedIn | Facebook | Instagram`;
        }
        
        return signature;
    };

    return (
        <section id="email-signature" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    Email Signature
                </h2>
                <p className="text-sm text-green-100 mt-1">Customize your professional email signature</p>
            </div>
            
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="emailSignature" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Signature Content
                            </label>
                            <textarea 
                                name="emailSignature" 
                                id="emailSignature" 
                                value={form.emailSignature} 
                                onChange={handleChange}
                                rows={6}
                                className={cn(
                                    "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                    "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                    "text-gray-900 placeholder-gray-500 resize-none font-mono text-sm",
                                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                )}
                                placeholder={`John Doe
Real Estate Agent
ACS Real Estate
Phone: (555) 123-4567
Email: john.doe@acsrealestate.com`}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {form.emailSignature.length}/1000 characters
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Signature Options</label>
                            
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="includeLogo" 
                                        checked={form.includeLogo} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm text-gray-700">Include ACS logo in signature</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="includeSocialLinks" 
                                        checked={form.includeSocialLinks} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm text-gray-700">Include social media links</span>
                                </label>
                            </div>
                        </div>
                        
                        {/* Preview Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Signature Preview</label>
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="flex items-center gap-2 text-sm text-[#0e6537] hover:text-[#157a42] transition-colors"
                                >
                                    {previewMode ? (
                                        <>
                                            <EyeOff className="w-4 h-4" />
                                            Hide Preview
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4" />
                                            Show Preview
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            {previewMode && (
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                        {generatePreviewSignature()}
                                    </pre>
                                </div>
                            )}
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
                            <p className="text-sm text-green-700">Email signature updated successfully!</p>
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
                                    Save Signature
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
} 