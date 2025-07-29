import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchNavigation } from './SearchNavigation';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation()

    const showSearchNavigation = location.pathname.startsWith('/search') || location.pathname.startsWith('/movie')
    return (
        <div className="min-h-screen bg-black">
            {showSearchNavigation && <SearchNavigation />}
            <main className="w-full">
                {children}
            </main>
        </div>
    )
}