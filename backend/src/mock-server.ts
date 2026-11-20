const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const JWT_SECRET = 'credit-super-secret-key-32chars!!';

// In-memory Ledger State
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'BORROWER' | 'LENDER' | 'BANK_OFFICER';
}

interface Transaction {
  id: string;
  borrowerId: string;
  lenderId: string;
  amount: string;
  type: 'LOAN' | 'REPAYMENT';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  description?: string;
  dueDate?: string;
  verifiedAt?: string;
  previousHash: string;
  currentHash?: string;
  createdAt: string;
  borrower?: User;
  lender?: User;
}

interface ConsentRequest {
  id: string;
  borrowerId: string;
  bankOfficerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  consentToken?: string;
  createdAt: string;
  borrower?: User;
  bankOfficer?: User;
}

// Seed Users
const users: User[] = [
  { id: 'b0000000-0000-0000-0000-000000000001', name: 'Alice Kumar', email: 'borrower1@test.com', phone: '9876543210', role: 'BORROWER' },
  { id: 'b0000000-0000-0000-0000-000000000002', name: 'Bob Singh', email: 'borrower2@test.com', phone: '9876543211', role: 'BORROWER' },
  { id: 'l0000000-0000-0000-0000-000000000001', name: 'Ram Groceries', email: 'lender1@test.com', phone: '9876543213', role: 'LENDER' },
  { id: 'l0000000-0000-0000-0000-000000000002', name: 'Shyam Electronics', email: 'lender2@test.com', phone: '9876543214', role: 'LENDER' },
  { id: 'o0000000-0000-0000-0000-000000000001', name: 'Officer Sharma', email: 'officer@bank.com', phone: '9876543216', role: 'BANK_OFFICER' },
];

function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Seed Transactions with cryptographic hash chain
let previousHash = 'GENESIS_HASH_000';
const transactions: Transaction[] = [];

const seedTxData = [
  { lenderId: users[2].id, amount: '1500.00', type: 'LOAN' as const, desc: 'Grocery advance credit', daysAgo: 45 },
  { lenderId: users[2].id, amount: '1500.00', type: 'REPAYMENT' as const, desc: 'Grocery loan repayment', daysAgo: 30 },
  { lenderId: users[3].id, amount: '4500.00', type: 'LOAN' as const, desc: 'Shop inventory appliances', daysAgo: 25 },
  { lenderId: users[3].id, amount: '4500.00', type: 'REPAYMENT' as const, desc: 'Inventory repayment', daysAgo: 10 },
];

for (const s of seedTxData) {
  const verifiedAt = new Date(Date.now() - s.daysAgo * 86400000).toISOString();
  const currentHash = sha256(`${previousHash}${users[0].id}${s.lenderId}${s.amount}${s.type}${verifiedAt}`);
  transactions.push({
    id: crypto.randomUUID(),
    borrowerId: users[0].id,
    lenderId: s.lenderId,
    amount: s.amount,
    type: s.type,
    status: 'VERIFIED',
    description: s.desc,
    verifiedAt,
    previousHash,
    currentHash,
    createdAt: verifiedAt,
    borrower: users[0],
    lender: users.find(u => u.id === s.lenderId),
  });
  previousHash = currentHash;
}

const otps: Record<string, { otp: string; expiresAt: number }> = {};
const consentRequests: ConsentRequest[] = [];

// Helper Auth Middleware
function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = users.find(u => u.id === payload.sub);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'credit-mock-backend', timestamp: new Date().toISOString() });
});

app.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user, token });
});

app.post('/auth/register', (req, res) => {
  const { name, email, phone, role } = req.body;
  const user: User = { id: crypto.randomUUID(), name, email, phone, role };
  users.push(user);
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user, token });
});

app.get('/auth/me', authMiddleware, (req: any, res) => {
  res.json(req.user);
});

// Transactions
app.post('/transactions', authMiddleware, (req: any, res) => {
  const { lenderId, amount, type, description, dueDate } = req.body;
  const lender = users.find(u => u.id === lenderId);
  const lastVerified = [...transactions].reverse().find(t => t.status === 'VERIFIED');
  const prevH = lastVerified ? (lastVerified.currentHash || 'GENESIS_HASH_000') : 'GENESIS_HASH_000';

  const tx: Transaction = {
    id: crypto.randomUUID(),
    borrowerId: req.user.id,
    lenderId,
    amount: parseFloat(amount).toFixed(2),
    type,
    status: 'PENDING',
    description,
    dueDate,
    previousHash: prevH,
    createdAt: new Date().toISOString(),
    borrower: req.user,
    lender,
  };
  transactions.unshift(tx);

  // Generate 6-digit OTP (10-minute TTL)
  const otp = crypto.randomInt(100000, 999999).toString();
  otps[tx.id] = { otp, expiresAt: Date.now() + 600000 };

  res.status(201).json({
    transaction: tx,
    otp,
    message: 'Transaction logged. Share this 6-digit OTP with your counterparty to verify.',
  });
});

app.get('/transactions/my', authMiddleware, (req: any, res) => {
  const userTx = transactions.filter(t => t.borrowerId === req.user.id);
  res.json(userTx);
});

app.get('/transactions/pending', authMiddleware, (req: any, res) => {
  const pending = transactions.filter(t => t.lenderId === req.user.id && t.status === 'PENDING');
  res.json(pending);
});

app.get('/transactions/verified', authMiddleware, (req: any, res) => {
  const verified = transactions.filter(t => t.lenderId === req.user.id && t.status === 'VERIFIED');
  res.json(verified);
});

app.post('/transactions/:id/verify', authMiddleware, (req: any, res) => {
  const { id } = req.params;
  const { otp } = req.body;
  const tx = transactions.find(t => t.id === id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  if (tx.status !== 'PENDING') return res.status(400).json({ message: 'Transaction already verified' });

  const record = otps[id];
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const verifiedAt = new Date().toISOString();
  const currentHash = sha256(`${tx.previousHash}${tx.borrowerId}${tx.lenderId}${tx.amount}${tx.type}${verifiedAt}`);

  tx.status = 'VERIFIED';
  tx.verifiedAt = verifiedAt;
  tx.currentHash = currentHash;
  delete otps[id];

  res.json({
    message: 'Transaction successfully verified and added to cryptographic ledger',
    transaction: tx,
  });
});

// Consent
app.post('/consent/request', authMiddleware, (req: any, res) => {
  const { borrowerId } = req.body;
  const borrower = users.find(u => u.id === borrowerId);
  const consentReq: ConsentRequest = {
    id: crypto.randomUUID(),
    borrowerId,
    bankOfficerId: req.user.id,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    borrower,
    bankOfficer: req.user,
  };
  consentRequests.unshift(consentReq);
  res.status(201).json({ message: 'Consent request created', consentRequest: consentReq });
});

app.get('/consent/pending', authMiddleware, (req: any, res) => {
  const pending = consentRequests.filter(c => c.borrowerId === req.user.id && c.status === 'PENDING');
  res.json(pending);
});

app.get('/consent/officer-requests', authMiddleware, (req: any, res) => {
  const officerReqs = consentRequests.filter(c => c.bankOfficerId === req.user.id);
  res.json(officerReqs);
});

app.post('/consent/:id/approve', authMiddleware, (req: any, res) => {
  const { id } = req.params;
  const c = consentRequests.find(reqItem => reqItem.id === id);
  if (!c) return res.status(404).json({ message: 'Consent request not found' });
  
  const token = jwt.sign(
    { sub: c.id, borrowerId: c.borrowerId, bankOfficerId: c.bankOfficerId, type: 'BANK_CREDIT_REPORT_ACCESS' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  c.status = 'APPROVED';
  c.consentToken = token;

  res.json({
    message: 'Consent granted successfully. Access token issued for Bank Officer.',
    consentRequest: c,
    consentToken: token,
  });
});

app.post('/consent/:id/reject', authMiddleware, (req: any, res) => {
  const { id } = req.params;
  const c = consentRequests.find(reqItem => reqItem.id === id);
  if (!c) return res.status(404).json({ message: 'Consent request not found' });
  c.status = 'REJECTED';
  res.json({ message: 'Consent rejected', consentRequest: c });
});

// Credit Report
app.get('/credit-report/:borrowerId', authMiddleware, (req: any, res) => {
  const { borrowerId } = req.params;
  const consentToken = req.headers['consent-token'] as string;
  if (!consentToken) return res.status(401).json({ message: 'Missing consent token' });

  try {
    const payload = jwt.verify(consentToken, JWT_SECRET) as any;
    if (payload.borrowerId !== borrowerId) {
      return res.status(403).json({ message: 'Consent token does not match borrower' });
    }
  } catch {
    return res.status(401).json({ message: 'Invalid or expired consent token' });
  }

  const borrower = users.find(u => u.id === borrowerId);
  const borrowerTx = transactions.filter(t => t.borrowerId === borrowerId && t.status === 'VERIFIED');
  const uniqueLenders = new Set(borrowerTx.map(t => t.lenderId)).size;
  const loans = borrowerTx.filter(t => t.type === 'LOAN');
  const repayments = borrowerTx.filter(t => t.type === 'REPAYMENT');

  const report = {
    score: Math.min(850, 680 + uniqueLenders * 20 + repayments.length * 10),
    riskTier: uniqueLenders >= 2 ? 'GOOD' : 'FAIR',
    punctualityPct: 92.5,
    uniqueLenderCount: uniqueLenders,
    totalLoans: loans.length,
    totalRepayments: repayments.length,
    collusionFlag: uniqueLenders < 2 && borrowerTx.length >= 5,
    hashChainValid: true,
  };

  res.json({
    borrower,
    creditReport: report,
    auditTrail: borrowerTx,
    meta: {
      generatedAt: new Date().toISOString(),
      officerId: req.user.id,
      consentRequestId: crypto.randomUUID(),
    },
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CreditLedger API server live at http://localhost:${PORT}`);
});
