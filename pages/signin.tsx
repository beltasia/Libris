
import { useState } from 'react';
import Layout from '@/components/layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';

function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login');
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const getAuthErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use': return 'Email already in use';
      case 'auth/invalid-email': return 'Invalid email format';
      case 'auth/weak-password': return 'Password is too weak';
      default: return 'Sign up failed';
    }
  };

  return (
    <Layout>
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-400 via-blue-200 to-cyan-100" />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <form onSubmit={handleSubmit} className="relative z-10 card w-96 bg-white/80 shadow-2xl border-4 border-dashed border-blue-200 rounded-3xl backdrop-blur-xl animate-fade-in">
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 animate-gradient">Create Your Libris Account</h2>
            <p className="mb-4 text-blue-500 font-medium animate-float">Sign up to start your reading adventure</p>
            {error && (
              <div className="alert alert-error animate-shake mb-2">
                <span>{error}</span>
              </div>
            )}
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text text-blue-500 font-bold">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered border-2 border-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/70"
                required
                placeholder="e.g. fairy@magic.com"
              />
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text text-blue-500 font-bold">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered border-2 border-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/70"
                required
                placeholder="••••••••"
              />
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text text-blue-500 font-bold">Confirm Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered border-2 border-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/70"
                required
                placeholder="••••••••"
              />
            </div>
            <div className="card-actions justify-end mt-4 w-full">
              <button
                type="submit"
                className="btn btn-primary w-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce"
                disabled={isLoading}
              >
                {isLoading ? '✨ Creating account...' : '✨ Sign Up'}
              </button>
            </div>
            <p className="mt-4 text-sm text-blue-500">Already have an account? <Link href="/login" className="underline font-bold hover:text-blue-700 transition-colors">Login</Link></p>
          </div>
        </form>
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 1.2s ease; }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 4s ease-in-out infinite;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
          .animate-shake { animation: shake 0.5s; }
        `}</style>
      </div>
    </Layout>
  );
}

export default SigninPage;
