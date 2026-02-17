export const AUTH_TOKEN_STORAGE_KEY = 'school_auth_token';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || '';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const hasBackendApi = API_BASE_URL.length > 0;

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  token?: string;
  body?: unknown;
};

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!hasBackendApi) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not set');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export type BackendLoginResponse = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin' | 'staff';
  };
  token: string;
};

export type BackendStudent = {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  } | string;
  studentId?: string;
  class?: string;
  section?: string;
  createdAt?: string;
};

export type BackendBuilding = {
  _id: string;
  name: string;
  description?: string;
  rooms?: unknown[];
};

export type CreateBackendBuildingPayload = {
  name: string;
  description?: string;
};

export type BackendReport = {
  _id: string;
  studentId?: {
    _id?: string;
    studentId?: string;
    class?: string;
    section?: string;
  } | string;
  reportType?: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBackendReportPayload = {
  studentId: string;
  reportType: 'academic' | 'behavior' | 'incident' | 'health';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
};

export type CreateBackendStudentPayload = {
  name: string;
  email: string;
  password: string;
  studentId: string;
  class: string;
  section: string;
};

export function loginWithBackend(email: string, password: string) {
  return request<BackendLoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getBackendStudents(token: string) {
  return request<{ students: BackendStudent[] }>('/api/students', { token });
}

export function getBackendBuildings(token: string) {
  return request<{ buildings: BackendBuilding[] }>('/api/buildings', { token });
}

export function createBackendBuilding(token: string, payload: CreateBackendBuildingPayload) {
  return request('/api/buildings', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function getBackendReports(token: string) {
  return request<{ reports: BackendReport[] }>('/api/reports', { token });
}

export function createBackendReport(token: string, payload: CreateBackendReportPayload) {
  return request('/api/reports', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function createBackendStudent(token: string, payload: CreateBackendStudentPayload) {
  return request('/api/students', {
    method: 'POST',
    token,
    body: payload,
  });
}
