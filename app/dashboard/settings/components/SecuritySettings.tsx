"use client";

import { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, AlertCircle, Lock, Key, Eye, EyeOff, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecuritySettingsProps {
    userData: any;
    onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function SecuritySettings({ userData, onSave }: SecuritySettingsProps) {
    const [form, setForm] = useState({ 
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        enableTwoFactor: false,
        phoneNumber: '',
        enableLoginAlerts: true,
        enableSessionTimeout: true,
        sessionTimeoutMinutes: 30,
        enablePasswordHistory: true,
        requireStrongPassword: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        if (userData) {
            setForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                enableTwoFactor: userData.enableTwoFactor === true,
                phoneNumber: userData.phoneNumber || '',
                enableLoginAlerts: userData.enableLoginAlerts !== false,
                enableSessionTimeout: userData.enableSessionTimeout !== false,
                sessionTimeoutMinutes: userData.sessionTimeoutMinutes || 30,
                enablePasswordHistory: userData.enablePasswordHistory !== false,
                requireStrongPassword: userData.requireStrongPassword !== false
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

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            errors: [
                password.length < minLength && 'At least 8 characters',
                !hasUpperCase && 'One uppercase letter',
                !hasLowerCase && 'One lowercase letter',
                !hasNumbers && 'One number',
                !hasSpecialChar && 'One special character'
            ].filter(Boolean)
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validate passwords if changing
        if (form.newPassword) {
            if (form.newPassword !== form.confirmPassword) {
                setError('New passwords do not match.');
                setLoading(false);
                return;
            }

            if (form.requireStrongPassword) {
                const validation = validatePassword(form.newPassword);
                if (!validation.isValid) {
                    setError(`Password requirements not met: ${validation.errors.join(', ')}`);
                    setLoading(false);
                    return;
                }
            }
        }

        try {
            const result = await onSave(form);

            if (result.success) {
                setSuccess(true);
                // Clear password fields on success
                setForm(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
                // Auto-hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || 'Failed to update security settings.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const passwordValidation = form.newPassword ? validatePassword(form.newPassword) : null;

    return (
        <section id="security" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    Security Settings
                </h2>
                <p className="text-sm text-green-100 mt-1">Manage your account security and authentication</p>
            </div>
            
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Password Change */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#0e6537]" />
                            Change Password
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPasswords.current ? "text" : "password"}
                                        name="currentPassword" 
                                        id="currentPassword" 
                                        value={form.currentPassword} 
                                        onChange={handleChange}
                                        className={cn(
                                            "block w-full px-4 py-3 pr-12 rounded-lg border shadow-sm transition-all duration-200",
                                            "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                            "text-gray-900 placeholder-gray-500",
                                            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                        )}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.current ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPasswords.new ? "text" : "password"}
                                        name="newPassword" 
                                        id="newPassword" 
                                        value={form.newPassword} 
                                        onChange={handleChange}
                                        className={cn(
                                            "block w-full px-4 py-3 pr-12 rounded-lg border shadow-sm transition-all duration-200",
                                            "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                            "text-gray-900 placeholder-gray-500",
                                            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                        )}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                
                                {/* Password strength indicator */}
                                {form.newPassword && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={cn(
                                                "h-2 flex-1 rounded-full",
                                                passwordValidation?.isValid 
                                                    ? "bg-green-500" 
                                                    : "bg-gray-200"
                                            )} />
                                            <span className="text-xs text-gray-500">
                                                {passwordValidation?.isValid ? "Strong" : "Weak"}
                                            </span>
                                        </div>
                                        {passwordValidation && !passwordValidation.isValid && (
                                            <ul className="text-xs text-red-600 space-y-1">
                                                {passwordValidation.errors.map((error, index) => (
                                                    <li key={index}>• {error}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPasswords.confirm ? "text" : "password"}
                                        name="confirmPassword" 
                                        id="confirmPassword" 
                                        value={form.confirmPassword} 
                                        onChange={handleChange}
                                        className={cn(
                                            "block w-full px-4 py-3 pr-12 rounded-lg border shadow-sm transition-all duration-200",
                                            "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                            "text-gray-900 placeholder-gray-500",
                                            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                        )}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                
                                {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-[#0e6537]" />
                            Two-Factor Authentication
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="enableTwoFactor" 
                                        checked={form.enableTwoFactor} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Enable 2FA</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-7">Add an extra layer of security</p>
                            </div>
                            
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number for 2FA
                                </label>
                                <input 
                                    type="tel" 
                                    name="phoneNumber" 
                                    id="phoneNumber" 
                                    value={form.phoneNumber} 
                                    onChange={handleChange}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900 placeholder-gray-500",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Key className="w-5 h-5 text-[#0e6537]" />
                            Security Preferences
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="enableLoginAlerts" 
                                        checked={form.enableLoginAlerts} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Login Alerts</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="enableSessionTimeout" 
                                        checked={form.enableSessionTimeout} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Session Timeout</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="requireStrongPassword" 
                                        checked={form.requireStrongPassword} 
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#0e6537] border-gray-300 rounded focus:ring-[#0e6537] focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Require Strong Password</span>
                                </label>
                            </div>
                            
                            <div>
                                <label htmlFor="sessionTimeoutMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Session Timeout (minutes)
                                </label>
                                <input 
                                    type="number" 
                                    name="sessionTimeoutMinutes" 
                                    id="sessionTimeoutMinutes" 
                                    value={form.sessionTimeoutMinutes} 
                                    onChange={handleChange}
                                    min="5"
                                    max="480"
                                    disabled={!form.enableSessionTimeout}
                                    className={cn(
                                        "block w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200",
                                        "focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537]",
                                        "text-gray-900 placeholder-gray-500",
                                        !form.enableSessionTimeout && "bg-gray-100 cursor-not-allowed",
                                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" : "border-gray-300"
                                    )}
                                />
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
                            <p className="text-sm text-green-700">Security settings updated successfully!</p>
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
                                    Save Security Settings
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
} 