import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-black">
            <main className="w-full">
                {children}
            </main>
        </div>
    )
}

export default Layout