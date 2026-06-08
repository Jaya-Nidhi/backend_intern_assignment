export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: { notes: number };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: { email: string };
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
