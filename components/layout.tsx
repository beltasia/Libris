'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/services/firebase';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold text-purple-700 select-none cursor-default">
              Libris
            </span>
            {/* No sign in/out links on the main layout header for a cleaner look */}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
}