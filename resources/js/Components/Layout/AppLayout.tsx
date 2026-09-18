import React, { createContext, useContext, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { AuthModal } from '../UI/AuthModal';

interface AuthModalContextType {
    openAuth: (title?: string, description?: string, actionDescription?: string) => void;
    closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
    openAuth: () => {},
    closeAuth: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [authModalState, setAuthModalState] = useState<{
        isOpen: boolean;
        title?: string;
        description?: string;
        actionDescription?: string;
    }>({
        isOpen: false,
    });

    const openAuth = (title?: string, description?: string, actionDescription?: string) => {
        setAuthModalState({
            isOpen: true,
            title,
            description,
            actionDescription,
        });
    };

    const closeAuth = () => {
        setAuthModalState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleOpenSubmit = () => {
        window.location.href = '/problems/create';
    };

    return (
        <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
            <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-indigo-500 selection:text-white">
                <Navbar 
                    onOpenAuth={(t, d) => openAuth(t, d)}
                    onOpenSubmit={handleOpenSubmit}
                />

                <main className="flex-1 w-full">
                    {children}
                </main>

                <Footer />

                <MobileNav 
                    onOpenSubmit={handleOpenSubmit}
                    onOpenAuth={() => openAuth()}
                />

                <AuthModal
                    isOpen={authModalState.isOpen}
                    onClose={closeAuth}
                    title={authModalState.title}
                    description={authModalState.description}
                    actionDescription={authModalState.actionDescription}
                />
            </div>
        </AuthModalContext.Provider>
    );
}
