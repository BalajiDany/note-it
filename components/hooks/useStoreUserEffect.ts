import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";

export function useStoreUserEffect() {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const { user } = useUser();
    // When this state is set we know the server
    // has stored the user.
    const [userId, setUserId] = useState<Id<"users"> | null>(null);
    const hasStoredUser = useRef(false);

    const storeUser = useMutation(api.domains.user.storeUser);
    // Call the `storeUser` mutation function to store
    // the current user in the `users` table and return the `Id` value.
    useEffect(() => {
        // If the user is not logged in don't do anything
        if (!isAuthenticated || hasStoredUser.current) {
            return;
        }
        hasStoredUser.current = true;
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        async function createUser() {
            const id = await storeUser();
            setUserId(id);
        }

        createUser();
    }, [isAuthenticated, storeUser, user?.id]);
    // Combine the local state with the state from context
    return {
        isLoading: isLoading || (isAuthenticated && userId === null),
        isAuthenticated: isAuthenticated && userId !== null,
    };
}
