'use client'

import { useStoreUserEffect } from '@/components/hooks/useAuthState'
import { SignInButton } from '@clerk/nextjs'
import { MainContent } from '@/components/MainContent'

export default function Home() {
    const { isLoading, isAuthenticated } = useStoreUserEffect()
    
    return (
        <main>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <p>Loading...</p>
                </div>
            ) : !isAuthenticated ? (
                <div className="flex items-center justify-center h-screen">
                    <SignInButton />
                </div>
            ) : (
                <MainContent />
            )}
        </main>
    )
}