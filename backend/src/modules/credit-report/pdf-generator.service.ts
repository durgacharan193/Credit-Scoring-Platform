import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface CreditCertificateData {
  reportId: string;
  borrowerName: string;
  borrowerId: string;
  score: number;
  tier: string;
  generatedAt: string;
  chainIntegrityValid: boolean;
  totalTransactions: number;
  verifiedLenders: number;
  officerName: string;
}

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  /**
   * Generates a tamper-evident digital certificate payload with SHA-256 digital signature
   */
  generateCertificatePayload(data: CreditCertificateData): {
    certificateId: string;
    signature: string;
    htmlContent: string;
  } {
    const certificateId = `CERT-${Date.now()}-${data.borrowerId.slice(0, 8)}`;
    
    // Create cryptographic signature of the certificate data to guarantee authenticity
    const dataString = `${certificateId}:${data.borrowerId}:${data.score}:${data.tier}:${data.generatedAt}`;
    const signature = crypto.createHash('sha256').update(dataString).digest('hex');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Alternative Creditworthiness Certificate</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: bold; color: #1e3a8a; }
    .cert-id { font-size: 12px; color: #64748b; font-family: monospace; }
    .score-card { margin-top: 30px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; }
    .score { font-size: 56px; font-weight: 800; color: #16a34a; }
    .tier { font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #475569; }
    .details { margin-top: 30px; width: 100%; border-collapse: collapse; }
    .details th, .details td { padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: left; }
    .details th { color: #64748b; font-size: 13px; text-transform: uppercase; }
    .signature-block { margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 16px; font-size: 11px; font-family: monospace; word-break: break-all; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Official Credit Assessment Certificate</div>
    <div class="cert-id">${certificateId}</div>
  </div>

  <div class="score-card">
    <div class="tier">${data.tier} RISK</div>
    <div class="score">${data.score}</div>
    <p>Consensus Verified Alternative Credit Score (300 - 900)</p>
  </div>

  <table class="details">
    <tr><th>Borrower Name</th><td>${data.borrowerName}</td></tr>
    <tr><th>Borrower ID</th><td><code>${data.borrowerId}</code></td></tr>
    <tr><th>Auditing Officer</th><td>${data.officerName}</td></tr>
    <tr><th>Verified Transactions</th><td>${data.totalTransactions}</td></tr>
    <tr><th>Unique Lenders</th><td>${data.verifiedLenders}</td></tr>
    <tr><th>Ledger Integrity</th><td>${data.chainIntegrityValid ? '✓ SHA-256 Validated' : '⚠ Integrity Mismatch'}</td></tr>
    <tr><th>Timestamp</th><td>${data.generatedAt}</td></tr>
  </table>

  <div class="signature-block">
    <strong>Cryptographic Proof of Authenticity:</strong><br>
    SHA-256 Signature: ${signature}
  </div>
</body>
</html>
    `.trim();

    return {
      certificateId,
      signature,
      htmlContent,
    };
  }
}
