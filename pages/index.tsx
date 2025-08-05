"use client";

import { useState } from 'react';
import Layout from '@/components/layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const getAuthErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email format';
      case 'auth/user-not-found': return 'User not found';
      case 'auth/wrong-password': return 'Incorrect password';
      case 'auth/too-many-requests': return 'Too many attempts';
      default: return 'Login failed';
    }
  };

  return (
    <Layout>
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-purple-400 via-purple-300 to-purple-100" />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated floating shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="animate-bounce-slow absolute left-10 top-10 w-32 h-32 bg-pink-300 opacity-60 rounded-full blur-2xl" />
          <div className="animate-spin-slow absolute right-10 top-32 w-24 h-24 bg-blue-300 opacity-50 rounded-full blur-2xl" />
          <div className="animate-pulse absolute left-1/2 bottom-10 w-40 h-40 bg-yellow-200 opacity-40 rounded-full blur-2xl" />
        </div>

        <div className="z-10 w-full max-w-md px-6 py-8 flex flex-col justify-center items-center mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-400 to-purple-200 animate-gradient">
              Welcome to Libris
            </h1>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white border-opacity-30 w-full">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-800">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 rounded-md border border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white bg-opacity-70"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-800">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 rounded-md border border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white bg-opacity-70"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-purple-800">
                Don't have an account?{' '}
                <Link 
                  href="/signin" 
                  className="font-medium text-purple-600 hover:text-purple-800 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-xs text-purple-500 mt-2">
                <Link href="/dashboard" className="underline hover:text-purple-800">Go to Dashboard</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}