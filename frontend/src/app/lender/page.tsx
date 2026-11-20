'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, StoredUser } from '../../lib/auth';
import { transactionsApi } from '../../lib/api';
import { Navbar } from '../../components/ui/Navbar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function LenderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [pendingTx, setPendingTx] = useState<any[]>([]);
  const [verifiedTx, setVerifiedTx] = useState<any[]>([]);

  // Modal states
  const [activeTx, setActiveTx] = useState<any | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || stored.role !== 'LENDER') {
      router.push('/login?role=LENDER');
      return;
    }
    setUser(stored);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pending, verified] = await Promise.all([
        transactionsApi.pending().catch(() => []),
        transactionsApi.verified().catch(() => []),
      ]);
      setPendingTx(pending);
      setVerifiedTx(verified);
    } catch (err) {
      console.error('Error fetching lender data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerifyModal = (tx: any) => {
    setActiveTx(tx);
    setOtpInput('');
    setModalError(null);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTx || otpInput.length !== 6) {
      setModalError('Please enter the full 6-digit OTP');
      return;
    }

    setVerifying(true);
    setModalError(null);

    try {
      const res = await transactionsApi.verify(activeTx.id, otpInput);
      setSuccessBanner(
        `Consensus reached! Transaction verified and cryptographically hashed: ${res.transaction.currentHash.substring(
          0,
          16
        )}...`
      );
      setActiveTx(null);
      loadData();
    } catch (err: any) {
      setModalError(err.message || 'OTP verification failed');
    } finally {
      setVerifying(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} />
        <LoadingSpinner message="Loading merchant verification queue..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Merchant Verification Terminal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Shopkeeper / Lender ID: <code className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono">{user.id}</code>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              {pendingTx.length} Verifications Pending
            </span>
          </div>
        </div>

        {successBanner && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>{successBanner}</span>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Pending Transactions Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Incoming Cash Consensus Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Borrowers who logged cash transactions and provided you their 6-digit OTP
              </p>
            </div>
          </div>

          <div className="p-6">
            {pendingTx.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                🎉 No pending transactions waiting for your verification.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.type === 'LOAN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tx.type === 'LOAN' ? 'Borrower Received Cash' : 'Borrower Repaid Cash'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-2xl font-black font-mono text-slate-900">
                          ₹{parseFloat(tx.amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-1">
                          Borrower: <span className="font-bold text-slate-900">{tx.borrower?.name || 'Customer'}</span>
                        </div>
                        {tx.description && (
                          <div className="text-xs text-slate-500 mt-1 italic">
                            "{tx.description}"
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenVerifyModal(tx)}
                      className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition"
                    >
                      Enter 6-Digit OTP →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verified Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Verified History Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable records verified by this merchant terminal
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Verification Time</th>
                  <th className="px-6 py-3">Borrower</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Block Hash (SHA-256)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {verifiedTx.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No verified transactions yet.
                    </td>
                  </tr>
                ) : (
                  verifiedTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-500">
                        {tx.verifiedAt ? new Date(tx.verifiedAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-900">
                        {tx.borrower?.name || tx.borrowerId.substring(0, 8)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            tx.type === 'LOAN' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-mono font-bold text-slate-900">
                        ₹{parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-mono text-[10px] text-slate-500">
                        {tx.currentHash ? (
                          <span title={tx.currentHash}>
                            {tx.currentHash.substring(0, 14)}...{tx.currentHash.substring(tx.currentHash.length - 8)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* OTP Verification Modal */}
      {activeTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mx-auto mb-3">
                🔐
              </div>
              <h3 className="text-lg font-black text-slate-900">Two-Party OTP Verification</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit code shown on the customer's phone
              </p>
            </div>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{activeTx.borrower?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold font-mono text-slate-900">₹{parseFloat(activeTx.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Action:</span>
                <span className="font-bold text-amber-700">{activeTx.type}</span>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-center text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  pattern="[0-9]{6}"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center text-3xl font-mono tracking-widest font-black py-3 px-4 border-2 border-amber-300 rounded-2xl focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTx(null)}
                  className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying || otpInput.length !== 6}
                  className="flex-1 py-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {verifying ? 'Hashing & Locking...' : 'Confirm Consensus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
