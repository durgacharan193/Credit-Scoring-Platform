'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../../lib/api';
import { setStoredSession, getDashboardPath } from '../../lib/auth';
import { Navbar } from '../../components/ui/Navbar';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'BORROWER' | 'LENDER' | 'BANK_OFFICER'>('BORROWER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.register({ name, email, phone, password, role });
      setStoredSession(data.user, data.token);
      router.push(getDashboardPath(data.user.role));
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={null} />

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the decentralized cash credit network
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="e.g. Ramesh Patel"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="BORROWER">Borrower (New-to-Credit Consumer)</option>
                  <option value="LENDER">Lender / Merchant (Shopkeeper)</option>
                  <option value="BANK_OFFICER">Bank Verification Officer</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <span className="text-xs text-slate-500">
                Already registered?{' '}
                <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
