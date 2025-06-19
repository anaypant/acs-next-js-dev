'use client';

import { AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    conversationName, 
    isDeleting 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: () => void;
    conversationName: string;
    isDeleting: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Conversation</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete the conversation with <span className="font-medium">{conversationName}</span>? 
                    This action cannot be reversed.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg transition-colors flex items-center gap-2 ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                        }`}
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal; 