import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";

export function useStoreUserEffect() {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const { user } = useUser();

    const [userId, setUserId] = useState<Id<"users"> | null>(null);
    const hasStoredUser = useRef(false);

    const storeUser = useMutation(api.domains.user.storeUser);
    useEffect(() => {
        if (!isAuthenticated || hasStoredUser.current) {
            return;
        }
        hasStoredUser.current = true;

        async function createUser() {
            const id = await storeUser();
            setUserId(id);
        }

        createUser();
    }, [isAuthenticated, storeUser, user?.id]);

    return {
        isLoading: isLoading || (isAuthenticated && userId === null),
        isAuthenticated: isAuthenticated && userId !== null,
    };
}
