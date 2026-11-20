'use client';

import React from 'react';
import Link from 'next/link';
import { StoredUser, logout } from '../../lib/auth';

interface NavbarProps {
  user: StoredUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'BORROWER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LENDER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'BANK_OFFICER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ⚡
            </div>
            <div>
              <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight">
                CreditLedger
              </Link>
              <span className="hidden sm:inline-block ml-2 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Cash Consensus v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {user.role.replace('_', ' ')}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
