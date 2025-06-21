"use client";

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { useSettings } from './useSettings';
import { ProfileSettings } from './components/ProfileSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { DangerZone } from './components/DangerZone';
import { PreferencesSettings } from './components/PreferencesSettings';
import { BioSettings } from './components/BioSettings';
import { LCPSettings } from './components/LCPSettings';
import { EmailSignatureSettings } from './components/EmailSignatureSettings';

function SettingsContent() {
    const { userData, loading, error, updateSettings } = useSettings();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" text="Loading settings..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Settings</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and security settings.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8 max-w-4xl">
                    <ProfileSettings userData={userData} onSave={updateSettings} />
                    <BioSettings userData={userData} onSave={updateSettings} />
                    <EmailSignatureSettings userData={userData} onSave={updateSettings} />
                    <LCPSettings userData={userData} onSave={updateSettings} />
                    <PreferencesSettings userData={userData} onSave={updateSettings} />
                    <SecuritySettings userData={userData} onSave={updateSettings} />
                    <DangerZone />
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <div className="h-full overflow-hidden">
            <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner size="lg" text="Loading settings..." />}>
                    <SettingsContent />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
