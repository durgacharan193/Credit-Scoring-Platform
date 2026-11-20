import { PrismaClient, Role, TransactionType, TransactionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function computeHash(
  previousHash: string,
  borrowerId: string,
  lenderId: string,
  amount: string,
  type: string,
  timestamp: string,
): string {
  const data = previousHash + borrowerId + lenderId + amount + type + timestamp;
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Borrowers
  const alice = await prisma.user.upsert({
    where: { email: 'borrower1@test.com' },
    update: {},
    create: {
      name: 'Alice Kumar',
      email: 'borrower1@test.com',
      phone: '9876543210',
      passwordHash,
      role: Role.BORROWER,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'borrower2@test.com' },
    update: {},
    create: {
      name: 'Bob Singh',
      email: 'borrower2@test.com',
      phone: '9876543211',
      passwordHash,
      role: Role.BORROWER,
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'borrower3@test.com' },
    update: {},
    create: {
      name: 'Carol Patel',
      email: 'borrower3@test.com',
      phone: '9876543212',
      passwordHash,
      role: Role.BORROWER,
    },
  });

  // Create Lenders
  const ram = await prisma.user.upsert({
    where: { email: 'lender1@test.com' },
    update: {},
    create: {
      name: 'Ram Groceries',
      email: 'lender1@test.com',
      phone: '9876543213',
      passwordHash,
      role: Role.LENDER,
    },
  });

  const shyam = await prisma.user.upsert({
    where: { email: 'lender2@test.com' },
    update: {},
    create: {
      name: 'Shyam Electronics',
      email: 'lender2@test.com',
      phone: '9876543214',
      passwordHash,
      role: Role.LENDER,
    },
  });

  const geeta = await prisma.user.upsert({
    where: { email: 'lender3@test.com' },
    update: {},
    create: {
      name: 'Geeta Pharmacy',
      email: 'lender3@test.com',
      phone: '9876543215',
      passwordHash,
      role: Role.LENDER,
    },
  });

  // Create Bank Officer
  const officer = await prisma.user.upsert({
    where: { email: 'officer@bank.com' },
    update: {},
    create: {
      name: 'Officer Sharma',
      email: 'officer@bank.com',
      phone: '9876543216',
      passwordHash,
      role: Role.BANK_OFFICER,
    },
  });

  console.log('Users created:', { alice: alice.id, bob: bob.id, carol: carol.id, ram: ram.id, shyam: shyam.id, geeta: geeta.id, officer: officer.id });

  // Create 10 sample transactions for Alice with valid hash chain
  const txData = [
    { lenderId: ram.id, amount: '1500.00', type: TransactionType.LOAN, description: 'Grocery loan', daysAgo: 90 },
    { lenderId: ram.id, amount: '1500.00', type: TransactionType.REPAYMENT, description: 'Repayment for grocery loan', daysAgo: 75 },
    { lenderId: shyam.id, amount: '5000.00', type: TransactionType.LOAN, description: 'Electronics purchase credit', daysAgo: 70 },
    { lenderId: geeta.id, amount: '800.00', type: TransactionType.LOAN, description: 'Medicine credit', daysAgo: 60 },
    { lenderId: geeta.id, amount: '800.00', type: TransactionType.REPAYMENT, description: 'Repayment for medicine', daysAgo: 50 },
    { lenderId: shyam.id, amount: '5000.00', type: TransactionType.REPAYMENT, description: 'Repayment for electronics', daysAgo: 40 },
    { lenderId: ram.id, amount: '2000.00', type: TransactionType.LOAN, description: 'Second grocery loan', daysAgo: 35 },
    { lenderId: geeta.id, amount: '500.00', type: TransactionType.LOAN, description: 'Pharmacy advance', daysAgo: 25 },
    { lenderId: geeta.id, amount: '500.00', type: TransactionType.REPAYMENT, description: 'Pharmacy repayment', daysAgo: 15 },
    { lenderId: ram.id, amount: '2000.00', type: TransactionType.REPAYMENT, description: 'Second grocery repayment', daysAgo: 5 },
  ];

  let previousHash = 'GENESIS_HASH_000';

  for (const tx of txData) {
    const verifiedAt = new Date();
    verifiedAt.setDate(verifiedAt.getDate() - tx.daysAgo);

    const currentHash = computeHash(
      previousHash,
      alice.id,
      tx.lenderId,
      tx.amount,
      tx.type,
      verifiedAt.toISOString(),
    );

    await prisma.transaction.create({
      data: {
        borrowerId: alice.id,
        lenderId: tx.lenderId,
        amount: tx.amount,
        type: tx.type,
        status: TransactionStatus.VERIFIED,
        description: tx.description,
        verifiedAt,
        previousHash,
        currentHash,
      },
    });

    previousHash = currentHash;
  }

  console.log('10 transactions created for Alice');

  // Create CreditReport for Alice
  await prisma.creditReport.upsert({
    where: { borrowerId: alice.id },
    update: {},
    create: {
      borrowerId: alice.id,
      score: 720,
      riskTier: 'GOOD',
      punctualityPct: 85.0,
      uniqueLenderCount: 3,
      totalLoans: 5,
      totalRepayments: 5,
      collusionFlag: false,
      hashChainValid: true,
      lastCalculatedAt: new Date(),
    },
  });

  console.log('CreditReport created for Alice');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
