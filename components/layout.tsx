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
            <Link href="/" className="text-xl font-bold text-indigo-600">
              NovelApp
            </Link>
            {auth.currentUser ? (
              <button 
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                href="/login" 
                className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
}