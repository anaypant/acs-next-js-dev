"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AlertCircle } from 'lucide-react';

export function DangerZone() {
    const { data: session } = useSession();
    const [openDialog, setOpenDialog] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: (session as any)?.user?.id }),
                credentials: 'include',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete account.');
            }

            await signOut({ callbackUrl: '/' });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="danger">
            <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2"><AlertCircle /> Danger Zone</h2>
            <div className="bg-white p-6 rounded-lg shadow border border-red-300">
                <h3 className="text-lg font-medium text-red-900">Delete Account</h3>
                <p className="mt-1 text-sm text-red-700">Once you delete your account, there is no going back. Please be certain.</p>
                <button onClick={() => setOpenDialog(true)} className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete Your Account
                </button>
            </div>

            {openDialog && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete account
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Please type your email <strong className="font-bold">{session?.user?.email}</strong> to confirm.
                                            </p>
                                            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" disabled={loading || emailInput !== session?.user?.email} onClick={handleDeleteAccount} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                                <button type="button" onClick={() => setOpenDialog(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                            {error && <p className="text-sm text-red-600 p-4">{error}</p>}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
} 