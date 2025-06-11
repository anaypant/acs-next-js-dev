'use client';

import { Shield, ShieldOff } from 'lucide-react';

const OverrideStatus = ({ isEnabled }: { isEnabled: boolean }) => {
    return (
        <div className="group relative inline-flex items-center p-1.5 bg-gray-50 rounded-lg">
            {isEnabled ? (
                <ShieldOff className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            ) : (
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            )}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                {isEnabled ? (
                    "AI review checks are disabled for this conversation. The AI will not flag this conversation for review, even if it detects potential issues."
                ) : (
                    "AI review checks are enabled. The AI will flag this conversation for review if it detects any uncertainty or issues that need human attention."
                )}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </div>
        </div>
    );
};

export default OverrideStatus; 