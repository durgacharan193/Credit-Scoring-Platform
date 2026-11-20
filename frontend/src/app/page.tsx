'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredUser, StoredUser, getDashboardPath } from '../lib/auth';
import { Navbar } from '../components/ui/Navbar';

export default function HomePage() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Financial Inclusion via Cryptographic Ledger
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl leading-tight sm:leading-none">
          Build Formal Credit <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Through Daily Cash Transactions
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
          Designed for New-to-Credit (NTC) borrowers. Turn undocumented shop loans and cash repayments
          into a tamper-evident, SHA-256 verified credit score accepted by regulated banks.
        </p>

        {user ? (
          <div className="mt-10">
            <Link
              href={getDashboardPath(user.role)}
              className="inline-flex items-center px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
            >
              Go to Your Dashboard →
            </Link>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
            >
              Sign In to Platform
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition"
            >
              Create Free Account
            </Link>
          </div>
        )}

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left">
          {/* Borrower Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-105 transition">
              🤝
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Borrower Dashboard</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Log daily informal cash credit from local shopkeepers. Generate one-time counterparty OTPs, track your real-time 300–900 score, and approve bank audits.
            </p>
            <Link
              href="/login?role=BORROWER"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Access Borrower Portal →
            </Link>
          </div>

          {/* Lender Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-105 transition">
              🏪
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Merchant / Lender Portal</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Shopkeepers and local lenders verify cash transactions in seconds via 6-digit cryptographic OTPs stored in Redis, creating immutable cryptographic proof.
            </p>
            <Link
              href="/login?role=LENDER"
              className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              Access Merchant Portal →
            </Link>
          </div>

          {/* Bank Officer Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-105 transition">
              🏛️
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Bank Verification Portal</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Regulated bank officers search borrower profiles, dispatch consent requests, and verify audited creditworthiness reports with full SHA-256 chain validation.
            </p>
            <Link
              href="/login?role=BANK_OFFICER"
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              Access Bank Portal →
            </Link>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="mt-20 py-12 border-t border-slate-200 w-full">
          <h2 className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-8">
            Enterprise Fintech Security Architecture
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900">SHA-256</div>
              <div className="text-xs text-slate-500 mt-1">Hash Chain Ledger</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900">Redis OTP</div>
              <div className="text-xs text-slate-500 mt-1">600s Two-Party TTL</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900">Anti-Collusion</div>
              <div className="text-xs text-slate-500 mt-1">Closed-Loop Penalty</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900">JWT Consent</div>
              <div className="text-xs text-slate-500 mt-1">Short-Lived Bank Access</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        Alternative Credit Scoring Platform © 2026. Production-Ready Fintech Monorepo.
      </footer>
    </div>
  );
}
