'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, StoredUser } from '../../lib/auth';
import { transactionsApi, consentApi } from '../../lib/api';
import { Navbar } from '../../components/ui/Navbar';
import { ScoreGauge } from '../../components/ui/ScoreGauge';
import { HashBadge } from '../../components/ui/HashBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function BorrowerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [transactions, setTransactions] = useState<any[]>([]);
  const [consents, setConsents] = useState<any[]>([]);
  const [scoreData, setScoreData] = useState<{ score: number; tier: string; chainValid: boolean; hash?: string }>({
    score: 300,
    tier: 'UNRATED',
    chainValid: true,
  });

  // Form states
  const [lenderId, setLenderId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'LOAN' | 'REPAYMENT'>('LOAN');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [consentActionMessage, setConsentActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || stored.role !== 'BORROWER') {
      router.push('/login?role=BORROWER');
      return;
    }
    setUser(stored);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [txList, consentList] = await Promise.all([
        transactionsApi.my().catch(() => []),
        consentApi.pending().catch(() => []),
      ]);

      setTransactions(txList);
      setConsents(consentList);

      // Dynamically calculate alternative credit score from verified transactions
      const verifiedTx = txList.filter((t) => t.status === 'VERIFIED');
      if (verifiedTx.length === 0) {
        setScoreData({
          score: 300,
          tier: 'UNRATED',
          chainValid: true,
          hash: undefined,
        });
      } else {
        const uniqueLenders = new Set(verifiedTx.map((t) => t.lenderId)).size;
        const repayments = verifiedTx.filter((t) => t.type === 'REPAYMENT');
        const loans = verifiedTx.filter((t) => t.type === 'LOAN');
        
        // Base 300 + 60 pts per unique merchant + 70 pts per repayment + 20 pts per loan
        const calculated = Math.min(
          850,
          300 + (uniqueLenders * 60) + (repayments.length * 70) + (loans.length * 20)
        );
        let tier = 'POOR';
        if (calculated >= 750) tier = 'EXCELLENT';
        else if (calculated >= 700) tier = 'GOOD';
        else if (calculated >= 650) tier = 'FAIR';
        else if (calculated >= 600) tier = 'AVERAGE';
        else if (calculated >= 550) tier = 'BELOW_AVERAGE';

        setScoreData({
          score: calculated,
          tier,
          chainValid: true,
          hash: verifiedTx[0].currentHash,
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setGeneratedOtp(null);

    try {
      const res = await transactionsApi.create({
        lenderId,
        amount: parseFloat(amount),
        type,
        description: description || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      setGeneratedOtp(res.otp);
      setOtpNotice(res.message);
      // Reset form fields
      setAmount('');
      setDescription('');
      setDueDate('');
      loadDashboardData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create transaction');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleApproveConsent = async (requestId: string) => {
    try {
      const res = await consentApi.approve(requestId);
      setConsentActionMessage(`Consent approved! Access token generated: ${res.consentToken.substring(0, 16)}...`);
      loadDashboardData();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleRejectConsent = async (requestId: string) => {
    try {
      await consentApi.reject(requestId);
      setConsentActionMessage('Consent request rejected.');
      loadDashboardData();
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} />
        <LoadingSpinner message="Loading borrower financial ledger..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Borrower Financial Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Account ID: <code className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono">{user.id}</code>
            </p>
          </div>
          <div>
            <HashBadge isValid={scoreData.chainValid} hash={scoreData.hash} />
          </div>
        </div>

        {/* Top Grid: Score Gauge & Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreGauge score={scoreData.score} riskTier={scoreData.tier} />

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Two-Party Consensus
                </span>
                <h4 className="text-lg font-bold text-slate-800 mt-1">OTP-Locked Transactions</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Every cash loan and repayment requires counterparty consensus via a 6-digit OTP stored with a 10-minute TTL in Redis.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Transactions</span>
                <span className="font-bold text-slate-900">{transactions.length}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Anti-Collusion Engine
                </span>
                <h4 className="text-lg font-bold text-slate-800 mt-1">Lender Diversity Shield</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Borrowing from multiple independent merchants builds higher credibility and avoids closed-loop collusion penalties.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Chain Status</span>
                <span className="font-bold text-emerald-600">Tamper-Proof SHA-256</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Consents Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bank Consent & Underwriting Authorizations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regulated banks must obtain your explicit short-lived consent token before accessing your credit file.
                </p>
              </div>
            </div>
            {consents.length > 0 && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold animate-pulse">
                {consents.length} Action Required
              </span>
            )}
          </div>

          {consentActionMessage && (
            <div className="mb-4 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
              <span>{consentActionMessage}</span>
              <button onClick={() => setConsentActionMessage(null)} className="font-bold text-emerald-700">✕</button>
            </div>
          )}

          {consents.length > 0 ? (
            <div className="space-y-3">
              {consents.map((req) => (
                <div
                  key={req.id}
                  className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Bank Officer: {req.bankOfficer?.name || 'Officer Sharma (State Bank Underwriting)'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Requested on {new Date(req.createdAt).toLocaleDateString()} at{' '}
                      {new Date(req.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveConsent(req.id)}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>🔑</span> Approve 1h Token
                    </button>
                    <button
                      onClick={() => handleRejectConsent(req.id)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-3">
                No active bank consent requests pending. When a bank officer searches your profile, their access request will appear here with an "Approve 1h Token" button.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await consentApi.request(user.id);
                    loadDashboardData();
                  } catch (e: any) {
                    alert('Error creating demo request: ' + e.message);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition"
              >
                + Create Demo Consent Request from Bank Officer
              </button>
            </div>
          )}
        </div>

        {/* Form: Log Cash Loan / Repayment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Log Informal Cash Transaction</h3>
          <p className="text-xs text-slate-500 mb-6">
            Record a cash exchange with a verified shopkeeper/lender. The generated OTP must be confirmed by the merchant.
          </p>

          {/* Generated OTP Alert (Demo Highlights) */}
          {generatedOtp && (
            <div className="mb-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center animate-fade-in">
              <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block mb-1">
                ⚡ Two-Party Consensus OTP Generated (10-Min TTL)
              </span>
              <div className="text-4xl font-black font-mono tracking-widest text-emerald-950 my-2">
                {generatedOtp}
              </div>
              <p className="text-xs text-emerald-700 max-w-md mx-auto mb-3">
                {otpNotice || 'Share this 6-digit code with your lender to verify this transaction in their portal.'}
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(generatedOtp)}
                className="px-4 py-1.5 text-xs font-bold bg-white text-emerald-800 border border-emerald-300 rounded-lg shadow-xs hover:bg-emerald-100"
              >
                Copy OTP to Clipboard
              </button>
            </div>
          )}

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateTransaction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Lender / Merchant ID
              </label>
              <input
                type="text"
                required
                value={lenderId}
                onChange={(e) => setLenderId(e.target.value)}
                placeholder="UUID of merchant (e.g. from seed)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Amount (₹ / USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500.00"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Transaction Type
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="LOAN">Cash Loan Received</option>
                <option value="REPAYMENT">Cash Repayment Made</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Description / Memo
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Monthly grocery supplies credit"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {formSubmitting ? 'Logging...' : 'Log & Generate OTP'}
              </button>
            </div>
          </form>
        </div>

        {/* Immutable Audit Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cryptographic Transaction Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only blockchain-style SHA-256 hash linked ledger
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
              {transactions.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Lender / Counterparty</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Cryptographic Hash</th>
                  <th className="px-6 py-3">Verified At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      No cash transactions logged yet. Log your first loan or repayment above!
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            tx.type === 'LOAN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-900">
                        {tx.lender?.name || tx.lenderId.substring(0, 8)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-mono font-bold text-slate-900">
                        ₹{parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            tx.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-mono text-[10px] text-slate-500">
                        {tx.currentHash ? (
                          <span title={tx.currentHash}>
                            {tx.currentHash.substring(0, 12)}...{tx.currentHash.substring(tx.currentHash.length - 8)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending Consensus</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-500">
                        {tx.verifiedAt ? new Date(tx.verifiedAt).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
