import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";

export function useStoreUserEffect() {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const { user } = useUser();

    const [userId, setUserId] = useState<Id<"users"> | null>(() => {
        // Try to get cached userId from sessionStorage for faster initial load
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem('convex-user-id');
            return cached as Id<"users"> | null;
        }
        return null;
    });

    const [isStoring, setIsStoring] = useState(false);
    const storeUser = useMutation(api.domains.user.storeUser);

    const userIdRef = useRef<string | null>(null);
    const isCreatingRef = useRef(false);

    const createUser = useCallback(async () => {
        if (isCreatingRef.current || !user?.id) return;

        // Check cache first
        const cachedKey = `user-stored-${user.id}`;
        const cached = sessionStorage.getItem(cachedKey);

        if (cached && userId) {
            userIdRef.current = user.id;
            return;
        }

        isCreatingRef.current = true;
        setIsStoring(true);

        try {
            const id = await storeUser();
            setUserId(id);
            userIdRef.current = user.id;

            // Cache the result
            sessionStorage.setItem('convex-user-id', id);
            sessionStorage.setItem(cachedKey, 'true');
        } catch (error) {
            console.error('Failed to store user:', error);
            // Clear cache on error
            sessionStorage.removeItem('convex-user-id');
            sessionStorage.removeItem(cachedKey);
            userIdRef.current = null;
        } finally {
            setIsStoring(false);
            isCreatingRef.current = false;
        }
    }, [storeUser, user?.id, userId]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            setUserId(null);
            userIdRef.current = null;
            // Clear cache when user logs out
            sessionStorage.removeItem('convex-user-id');
            sessionStorage.removeItem(`user-stored-${user?.id}`);
            return;
        }

        if (userIdRef.current === user.id && userId) {
            return;
        }

        createUser();
    }, [isAuthenticated, user?.id, createUser]);

    useEffect(() => {
        return () => {
            setUserId(null);
            userIdRef.current = null;
            isCreatingRef.current = false;
        };
    }, []);

    return {
        isLoading: isLoading || (isAuthenticated && userId === null && isStoring),
        isAuthenticated: isAuthenticated && userId !== null,
        userId,
    };
}