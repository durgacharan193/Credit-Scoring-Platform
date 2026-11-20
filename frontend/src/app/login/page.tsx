'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../../lib/api';
import { setStoredSession, getDashboardPath } from '../../lib/auth';
import { Navbar } from '../../components/ui/Navbar';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<'BORROWER' | 'LENDER' | 'BANK_OFFICER'>('BORROWER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'LENDER' || roleParam === 'BANK_OFFICER' || roleParam === 'BORROWER') {
      setSelectedRole(roleParam);
      fillDemoCreds(roleParam);
    } else {
      fillDemoCreds('BORROWER');
    }
  }, [searchParams]);

  const fillDemoCreds = (role: 'BORROWER' | 'LENDER' | 'BANK_OFFICER') => {
    setSelectedRole(role);
    if (role === 'BORROWER') {
      setEmail('borrower1@test.com');
      setPassword('password123');
    } else if (role === 'LENDER') {
      setEmail('lender1@test.com');
      setPassword('password123');
    } else if (role === 'BANK_OFFICER') {
      setEmail('officer@bank.com');
      setPassword('password123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.login(email, password);
      setStoredSession(data.user, data.token);
      router.push(getDashboardPath(data.user.role));
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
      {/* Role Quick Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => fillDemoCreds('BORROWER')}
          className={`py-2 text-xs font-bold rounded-lg transition ${
            selectedRole === 'BORROWER'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Borrower
        </button>
        <button
          type="button"
          onClick={() => fillDemoCreds('LENDER')}
          className={`py-2 text-xs font-bold rounded-lg transition ${
            selectedRole === 'LENDER'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Lender
        </button>
        <button
          type="button"
          onClick={() => fillDemoCreds('BANK_OFFICER')}
          className={`py-2 text-xs font-bold rounded-lg transition ${
            selectedRole === 'BANK_OFFICER'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bank Officer
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Email Address
          </label>
          <div className="mt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="you@domain.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <span className="text-xs text-slate-500">
          New user?{' '}
          <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={null} />

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CreditLedger
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Select your role to load demo credentials or enter custom details
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Suspense fallback={<div className="text-center p-8 text-sm text-slate-400">Loading sign-in form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
