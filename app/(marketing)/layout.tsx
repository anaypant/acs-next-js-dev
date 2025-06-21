import { PageLayout } from '@/components/common/Layout/PageLayout';
import React from 'react';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageLayout>
            {children}
        </PageLayout>
    );
} 