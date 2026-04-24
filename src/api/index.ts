import axios from 'axios';
import { passwordEncryptor } from '../utils/passwordEncryptor';

const API_BASE_URL = '/api';

const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\s+/g, ' ')
    .trim();
};

const isSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|JOIN|WHERE|FROM|GROUP|ORDER|HAVING)\b/i,
    /--|#|\/\*/,
    /\bor\b|\band\b/i,
    /\bOR\b|\bAND\b/i
  ];
  return sqlPatterns.some(pattern => pattern.test(input));
};

export interface LoginRequest {
  account: string;
  password: string;
  encryption?: 'RSA-OAEP';
}

export interface RegisterRequest {
  account: string;
  password: string;
  phone?: string;
  email?: string;
  avatar?: string;
  user_type?: 'NORMAL' | 'ADMIN' | 'SUPER_ADMIN';
  extra_info?: string;
  encryption?: 'RSA-OAEP';
}

export interface User {
  account: string;
  email?: string;
  phone?: string;
  avatar?: string;
  user_type: string;
  extra_info?: string;
  uuid: string;
  created_at: number;
  updated_at: number;
}

export interface LoginResponse {
  state: number;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  state: number;
  message: string;
  data?: T;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshCount = 0;
let lastRefreshTime = 0;
const MAX_REFRESH_ATTEMPTS = 5;
const MIN_REFRESH_INTERVAL = 3000;

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const currentTime = Date.now();

      if (refreshCount >= MAX_REFRESH_ATTEMPTS) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        return Promise.reject(error);
      }

      if (currentTime - lastRefreshTime < MIN_REFRESH_INTERVAL) {
        return new Promise(resolve => {
          setTimeout(async () => {
            try {
              const result = await handleRefresh(originalRequest);
              resolve(result);
            } catch (err) {
              resolve(Promise.reject(err));
            }
          }, MIN_REFRESH_INTERVAL - (currentTime - lastRefreshTime));
        });
      }

      return handleRefresh(originalRequest);
    }
    return Promise.reject(error);
  }
);

async function handleRefresh(originalRequest: any) {
  originalRequest._retry = true;
  refreshCount++;
  lastRefreshTime = Date.now();

  try {
    const refreshResponse = await api.post('/auth/refresh');
    if (refreshResponse.data?.data?.access_token) {
      localStorage.setItem('access_token', refreshResponse.data.data.access_token);
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.access_token}`;
      }
      refreshCount = 0;
      return api(originalRequest);
    }
  } catch (refreshError) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return Promise.reject(refreshError);
  }

  return Promise.reject(new Error('Refresh failed'));
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const sanitizedAccount = sanitizeInput(data.account);

  if (isSQLInjection(sanitizedAccount)) {
    throw new Error('账号包含非法字符');
  }
  console.log(data);

  const response = await api.post('/auth/login', {
    account: sanitizedAccount,
    password: data.password,
    encryption: data.encryption || 'RSA-OAEP'
  });
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<ApiResponse> => {
  const sanitizedData = {
    account: sanitizeInput(data.account),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    email: data.email ? sanitizeInput(data.email) : undefined,
    avatar: data.avatar ? sanitizeInput(data.avatar) : undefined,
    user_type: data.user_type,
    extra_info: data.extra_info ? sanitizeInput(data.extra_info) : undefined
  };

  if (isSQLInjection(sanitizedData.account)) {
    throw new Error('账号包含非法字符');
  }

  if (sanitizedData.phone && isSQLInjection(sanitizedData.phone)) {
    throw new Error('手机号包含非法字符');
  }

  if (sanitizedData.email && isSQLInjection(sanitizedData.email)) {
    throw new Error('邮箱包含非法字符');
  }

  console.log(data);

  const response = await api.post('/user/create', {
    ...sanitizedData,
    password: data.password,
    encryption: data.encryption || 'RSA-OAEP'
  });
  return response.data;
};

export const getPublicKey = async (): Promise<string> => {
  const response = await api.get('/auth/public-key');
  return response.data;
};

export const logout = async (): Promise<ApiResponse> => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export default api;