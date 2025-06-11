import { useMemo } from 'react';

type TimeRange = 'day' | 'week' | 'month' | 'year';

export const useDashboardMetrics = (rawThreads: any[], timeRange: TimeRange) => {
    const metrics = useMemo(() => {
        if (!rawThreads || !rawThreads.length) {
            return {
                newLeads: 0,
                pendingReplies: 0,
                unopenedLeads: 0,
            };
        }

        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'day':
                startDate.setDate(now.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        const newMetrics = {
            newLeads: 0,
            pendingReplies: 0,
            unopenedLeads: 0,
        };

        rawThreads.forEach((threadData) => {
            const messages = threadData.messages || [];
            const thread = threadData.thread;

            if (thread && !thread.read) {
                newMetrics.unopenedLeads++;
            }

            if (messages.length > 0) {
                const firstMessage = messages.reduce((earliest: any, current: any) =>
                    new Date(earliest.timestamp) < new Date(current.timestamp) ? earliest : current
                );

                if (new Date(firstMessage.timestamp) >= startDate) {
                    newMetrics.newLeads++;
                }

                const latestMessage = messages.reduce((latest: any, current: any) =>
                    new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current
                );

                if (latestMessage.type === 'inbound-email') {
                    newMetrics.pendingReplies++;
                }
            }
        });

        return newMetrics;
    }, [rawThreads, timeRange]);

    return metrics;
}; 