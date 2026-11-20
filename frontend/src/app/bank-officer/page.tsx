'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, StoredUser } from '../../lib/auth';
import { consentApi, creditReportApi } from '../../lib/api';
import { Navbar } from '../../components/ui/Navbar';
import { ScoreGauge } from '../../components/ui/ScoreGauge';
import { HashBadge } from '../../components/ui/HashBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function BankOfficerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Consent Request states
  const [borrowerIdInput, setBorrowerIdInput] = useState('');
  const [consentTokenInput, setConsentTokenInput] = useState('');
  const [officerRequests, setOfficerRequests] = useState<any[]>([]);

  const [requestLoading, setRequestLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Credit Report data
  const [reportData, setReportData] = useState<{
    borrower: any;
    creditReport: any;
    auditTrail: any[];
    meta: any;
  } | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || stored.role !== 'BANK_OFFICER') {
      router.push('/login?role=BANK_OFFICER');
      return;
    }
    setUser(stored);
    loadRequests();
  }, [router]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const reqs = await consentApi.officerRequests().catch(() => []);
      setOfficerRequests(reqs);
    } catch (err) {
      console.error('Error fetching officer requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerIdInput.trim()) return;

    setRequestLoading(true);
    setStatusMessage(null);

    try {
      const res = await consentApi.request(borrowerIdInput.trim());
      setStatusMessage({
        text: `Consent request dispatched to Borrower! Status: PENDING borrower approval.`,
        type: 'success',
      });
      loadRequests();
    } catch (err: any) {
      setStatusMessage({
        text: err.message || 'Failed to dispatch consent request.',
        type: 'error',
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const handleFetchReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerIdInput.trim() || !consentTokenInput.trim()) {
      setStatusMessage({
        text: 'Both Borrower ID and Consent Token are required.',
        type: 'error',
      });
      return;
    }

    setReportLoading(true);
    setStatusMessage(null);

    try {
      const res = await creditReportApi.get(borrowerIdInput.trim(), consentTokenInput.trim());
      setReportData(res);
      setStatusMessage({
        text: 'Cryptographically verified report loaded successfully.',
        type: 'success',
      });
    } catch (err: any) {
      setStatusMessage({
        text: `Access Denied: ${err.message}`,
        type: 'error',
      });
    } finally {
      setReportLoading(false);
    }
  };

  const handleUseTokenFromList = (req: any) => {
    setBorrowerIdInput(req.borrowerId);
    if (req.consentToken) {
      setConsentTokenInput(req.consentToken);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} />
        <LoadingSpinner message="Initializing bank verification terminal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
      <div className="print:hidden">
        <Navbar user={user} />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header (Hidden in Print) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Regulated Bank Underwriting Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Verification Officer: <span className="font-bold text-slate-900">{user.name}</span> ({user.email})
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            <span>🛡️</span> Zero-Knowledge Consent Protocol
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`print:hidden p-4 rounded-2xl text-xs font-bold border flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)}>✕</button>
          </div>
        )}

        {/* Action Controls: Search & Token (Hidden in Print) */}
        <div className="print:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Request Consent */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">
                Step 1: Request Borrower Consent
              </h3>
              <button
                type="button"
                onClick={() => setBorrowerIdInput('b0000000-0000-0000-0000-000000000001')}
                className="text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg"
              >
                + Alice Kumar (Demo)
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter the Borrower ID to dispatch a signed notification requesting 1-hour audit access.
            </p>
            <form onSubmit={handleTriggerConsent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Borrower UUID
                </label>
                <input
                  type="text"
                  required
                  value={borrowerIdInput}
                  onChange={(e) => setBorrowerIdInput(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={requestLoading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {requestLoading ? 'Dispatching Consent Request...' : 'Trigger Consent Request →'}
              </button>
            </form>
          </div>

          {/* Box 2: Unlock Credit Report */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Step 2: Access Verified Report
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the approved JWT consent token provided by the borrower to decrypt the credit file.
            </p>
            <form onSubmit={handleFetchReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Consent Access Token (JWT)
                </label>
                <input
                  type="text"
                  required
                  value={consentTokenInput}
                  onChange={(e) => setConsentTokenInput(e.target.value)}
                  placeholder="Paste JWT issued upon borrower approval"
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={reportLoading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {reportLoading ? 'Validating Token & Ledger...' : 'Decrypt & View Credit Report 🔓'}
              </button>
            </form>
          </div>
        </div>

        {/* Consent Requests Log (Hidden in Print) */}
        {officerRequests.length > 0 && (
          <div className="print:hidden bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recent Consent Requests Dispatched
              </h4>
              <span className="text-xs text-slate-400">{officerRequests.length} recorded</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto text-xs">
              {officerRequests.map((r) => (
                <div key={r.id} className="p-3 px-6 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-semibold text-slate-900">
                      {r.borrower?.name || r.borrowerId.substring(0, 12)}
                    </span>
                    <span className="text-slate-400 ml-2">({r.borrower?.email || r.borrowerId})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>
                    <button
                      onClick={() => handleUseTokenFromList(r)}
                      className="text-xs text-purple-600 hover:text-purple-800 font-bold"
                    >
                      Load →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFICIAL CREDITWORTHINESS REPORT VIEW */}
        {reportData && (
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-lg print:border-none print:shadow-none print:p-0">
            {/* Certificate Header */}
            <div className="border-b-2 border-slate-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
                    Consensus Credit Bureau
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  New-to-Credit (NTC) Cash Underwriting Report
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Verified Audit Timestamp: <span className="font-mono">{reportData.meta.generatedAt}</span>
                </div>
              </div>

              <div className="print:hidden flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition"
                >
                  🖨️ Print / Save PDF
                </button>
              </div>
            </div>

            {/* Subject Profile */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-8">
              <div>
                <span className="text-slate-400 block font-semibold">Borrower Name</span>
                <span className="font-bold text-slate-900 text-sm">{reportData.borrower.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Contact Email</span>
                <span className="font-bold text-slate-900 text-sm">{reportData.borrower.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Phone</span>
                <span className="font-bold text-slate-900 text-sm">{reportData.borrower.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Ledger Registration</span>
                <span className="font-bold text-slate-900 text-sm">
                  {new Date(reportData.borrower.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Score & Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ScoreGauge
                score={reportData.creditReport.score}
                riskTier={reportData.creditReport.riskTier}
              />

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Repayment Punctuality
                  </div>
                  <div className="text-3xl font-black font-mono text-slate-900 mt-2">
                    {reportData.creditReport.punctualityPct}%
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, reportData.creditReport.punctualityPct)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Ratio of loans repaid on or before due date
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Lender Diversity
                  </div>
                  <div className="text-3xl font-black font-mono text-slate-900 mt-2">
                    {reportData.creditReport.uniqueLenderCount} Merchants
                  </div>
                  <div className="mt-3">
                    {reportData.creditReport.uniqueLenderCount >= 3 ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Healthy Merchant Diversity
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Limited Merchant Exposure
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Distinct verified shopkeepers traded with
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Anti-Collusion Flag
                  </div>
                  <div className="mt-2">
                    {reportData.creditReport.collusionFlag ? (
                      <div className="text-rose-600 font-bold text-sm flex items-center gap-1.5">
                        <span>⚠️</span> Closed-Loop Risk Detected
                      </div>
                    ) : (
                      <div className="text-emerald-600 font-bold text-sm flex items-center gap-1.5">
                        <span>🛡️</span> Zero Collusion Detected
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Checks for cyclic rapid loans with 1-2 counterparties
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cryptographic Integrity
                  </div>
                  <div className="mt-2">
                    <HashBadge
                      isValid={reportData.creditReport.hashChainValid}
                      hash={
                        reportData.auditTrail.length > 0
                          ? reportData.auditTrail[0].currentHash
                          : null
                      }
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Full SHA-256 block chain verified from Genesis
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Audit Trail Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Verified Audit Trail (Last 20 Transactions)
                </h4>
                <span className="text-xs text-slate-500">Append-Only Cryptographic Proof</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Lender</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Current Block SHA-256</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {reportData.auditTrail.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-4 py-2.5 whitespace-nowrap text-slate-500">
                          {new Date(tx.verifiedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
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
                        <td className="px-4 py-2.5 whitespace-nowrap font-medium text-slate-900">
                          {tx.lender?.name || tx.lenderId.substring(0, 8)}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap font-mono font-bold text-slate-900">
                          ₹{parseFloat(tx.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap font-mono text-[10px] text-slate-500">
                          {tx.currentHash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Certification Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
              <div>
                Authorized Bank Verification Officer: <span className="font-bold text-slate-700">{user.name}</span>
              </div>
              <div className="mt-2 sm:mt-0 font-mono">
                Consent Signature Ref: {reportData.meta.consentRequestId}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
