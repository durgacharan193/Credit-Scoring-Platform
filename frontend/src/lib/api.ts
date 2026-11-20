const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: { name: string; email: string; phone: string; password: string; role: string }) =>
    apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => apiRequest<any>('/auth/me'),
};

export const transactionsApi = {
  create: (data: { lenderId: string; amount: number; type: 'LOAN' | 'REPAYMENT'; description?: string; dueDate?: string }) =>
    apiRequest<{ transaction: any; otp: string; message: string }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  my: () => apiRequest<any[]>('/transactions/my'),
  pending: () => apiRequest<any[]>('/transactions/pending'),
  verified: () => apiRequest<any[]>('/transactions/verified'),
  verify: (id: string, otp: string) =>
    apiRequest<{ message: string; transaction: any }>(`/transactions/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),
  get: (id: string) => apiRequest<any>(`/transactions/${id}`),
};

export const consentApi = {
  request: (borrowerId: string) =>
    apiRequest<{ message: string; consentRequest: any }>('/consent/request', {
      method: 'POST',
      body: JSON.stringify({ borrowerId }),
    }),
  pending: () => apiRequest<any[]>('/consent/pending'),
  approve: (requestId: string) =>
    apiRequest<{ message: string; consentRequest: any; consentToken: string }>(`/consent/${requestId}/approve`, {
      method: 'POST',
    }),
  reject: (requestId: string) =>
    apiRequest<{ message: string; consentRequest: any }>(`/consent/${requestId}/reject`, {
      method: 'POST',
    }),
  officerRequests: () => apiRequest<any[]>('/consent/officer-requests'),
};

export const creditReportApi = {
  get: (borrowerId: string, consentToken: string) =>
    apiRequest<{ borrower: any; creditReport: any; auditTrail: any[]; meta: any }>(
      `/credit-report/${borrowerId}`,
      {
        headers: {
          'consent-token': consentToken,
        },
      }
    ),
};
