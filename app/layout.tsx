import ConvexClientProvider from '@/components/providers/convex-client-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
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