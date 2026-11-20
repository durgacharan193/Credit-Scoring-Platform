import React from 'react';

interface HashBadgeProps {
  isValid: boolean;
  hash?: string | null;
}

export const HashBadge: React.FC<HashBadgeProps> = ({ isValid, hash }) => {
  const shortHash = hash ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}` : 'GENESIS';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
        isValid
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-rose-50 text-rose-800 border-rose-200'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isValid ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isValid ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        ></span>
      </span>
      <span>{isValid ? 'Hash Chain Integrity: Verified' : 'Cryptographic Hash Compromised'}</span>
      {hash && (
        <code className="text-[10px] bg-white/70 px-1.5 py-0.5 rounded font-mono border border-slate-200">
          {shortHash}
        </code>
      )}
    </div>
  );
};
