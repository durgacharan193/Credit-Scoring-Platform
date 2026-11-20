export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'BORROWER' | 'LENDER' | 'BANK_OFFICER';
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredSession(user: StoredUser, token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'BORROWER':
      return '/borrower';
    case 'LENDER':
      return '/lender';
    case 'BANK_OFFICER':
      return '/bank-officer';
    default:
      return '/login';
  }
}
