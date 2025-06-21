import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDbOperations } from "@/hooks/useDbOperations";
import type { Session } from "next-auth";

export function useSettings() {
    const { data: session, status, update } = useSession();
    const { select, update: updateDb } = useDbOperations();
    
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = (session as any)?.user?.id;

    const fetchSettings = useCallback(async () => {
        if (status === 'loading' || !userId) return;
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await select({
                table_name: 'Users',
                index_name: 'id-index',
                key_name: 'id',
                key_value: userId,
            });

            if (error || !data || !data.items || data.items.length === 0) {
                throw new Error(error || "Failed to fetch user settings or user not found.");
            }
            
            setUserData(data.items[0]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId, status, select]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = useCallback(async (update_data: Record<string, any>) => {
        if (!userId) return { success: false, error: "User not authenticated" };

        const { success, error } = await updateDb({
            table_name: 'Users',
            index_name: 'id-index',
            key_name: 'id',
            key_value: userId,
            update_data: {
                ...update_data,
                updated_at: new Date().toISOString(),
            },
        });

        if (success) {
            await fetchSettings(); // Refresh data on successful update
            if (update_data.name || update_data.email) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: update_data.name || session?.user?.name,
                        email: update_data.email || session?.user?.email,
                    },
                });
            }
        }
        
        return { success, error };
    }, [userId, updateDb, fetchSettings, session, update]);

    return {
        session,
        userData,
        loading,
        error,
        updateSettings,
        fetchSettings,
        userId,
        status,
    };
} 