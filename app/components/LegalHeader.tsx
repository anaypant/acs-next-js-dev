import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LegalHeaderProps {
    title: string;
    description: string;
}

export function LegalHeader({ title, description }: LegalHeaderProps) {
    return (
        <>
            <Link
                href="/legal"
                className="inline-flex items-center gap-2 bg-[#0e6537] text-white px-4 py-2 rounded-lg hover:bg-[#0a5a2f] mb-4 transition-colors shadow-md"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Legal</span>
            </Link>

            <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 mb-6">
                <h1 className="text-2xl font-bold text-[#0e6537] mb-2">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>
        </>
    );
} 