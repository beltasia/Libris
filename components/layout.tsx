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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-50">
      <header>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold text-purple-700 select-none cursor-default bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-yellow-400 animate-gradient text-transparent">
              Libris
            </span>
            {/* No sign in/out links on the main layout header for a cleaner look */}
          </div>
        </nav>
      </header>
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease-in-out infinite;
        }
      `}</style>
      <main className="flex-grow">{children}</main>
    </div>
  );
}