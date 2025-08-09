import ConvexClientProvider from '@/components/providers/convex-client-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
            <body className="antialiased">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <ClerkProvider>
                        <ConvexClientProvider>
                            {children}
                        </ConvexClientProvider>
                    </ClerkProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}