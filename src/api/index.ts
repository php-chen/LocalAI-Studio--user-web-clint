import axios from 'axios';

const isProduction = import.meta.env.PROD;
const PROD_API_URL = 'http://103.236.97.248:60490';
const DEV_API_URL = '/api';

const API_BASE_URL = isProduction ? PROD_API_URL : DEV_API_URL;

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
const MIN_REFRESH_INTERVAL = 10000;

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 如果是登录请求，直接返回错误，不调用handleRefresh
      if (originalRequest.url?.includes('/auth/login') && error.response?.data?.message?.message === '账号或密码错误') {
        return Promise.reject(error);
      }

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
    console.log('开始刷新令牌...');
    console.log('当前 URL:', window.location.href);
    console.log('API_BASE_URL:', API_BASE_URL);

    // 从 localStorage 中获取 refresh_token
    const refreshToken = localStorage.getItem('refresh_token');
    console.log('从 localStorage 获取 refresh_token:', refreshToken);

    if (!refreshToken) {
      console.error('没有找到 refresh_token');
      throw new Error('No refresh token found');
    }

    // 创建一个新的 axios 实例，避免拦截器的影响
    const refreshApi = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 添加请求拦截器，查看发送的请求头
    refreshApi.interceptors.request.use(config => {
      console.log('刷新令牌请求配置:', config);
      console.log('刷新令牌请求头:', config.headers);
      return config;
    });

    console.log('发送刷新令牌请求...');
    // 手动发送 refresh_token
    const refreshResponse = await refreshApi.post('/auth/refresh', {
      refresh_token: refreshToken
    });
    console.log('刷新令牌响应:', refreshResponse);
    console.log('刷新令牌响应数据:', refreshResponse.data);

    // 存储新的 access_token 和 refresh_token
    if (refreshResponse.data.data?.access_token) {
      localStorage.setItem('access_token', refreshResponse.data.data.access_token);
      console.log('更新 access_token 成功');
    }

    if (refreshResponse.data.data?.refresh_token) {
      localStorage.setItem('refresh_token', refreshResponse.data.data.refresh_token);
      console.log('更新 refresh_token 成功');
    }

    // 更新原请求的 Authorization 头
    if (refreshResponse.data.data?.access_token && originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.access_token}`;
    }

    refreshCount = 0;
    console.log('令牌刷新成功');
    return api(originalRequest);
  } catch (refreshError: any) {
    console.error('刷新令牌错误:', refreshError);
    console.error('错误响应:', refreshError.response);
    console.error('错误消息:', refreshError.message);
    console.error('错误代码:', refreshError.code);

    // 清除本地存储的令牌
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');

    // 跳转到登录页面
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
  console.log('登录请求数据:', data);

  const response = await api.post('/auth/login', {
    account: sanitizedAccount,
    password: data.password,
    encryption: data.encryption || 'RSA-OAEP'
  });

  // 打印完整响应
  console.log('登录完整响应:', response);
  // 打印响应数据
  console.log('登录响应数据:', response.data);

  // 存储返回的 access_token 和 refresh_token
  if (response.data.data?.access_token) {
    localStorage.setItem('access_token', response.data.data.access_token);
    console.log('存储 access_token 成功');
  }

  if (response.data.data?.refresh_token) {
    localStorage.setItem('refresh_token', response.data.data.refresh_token);
    console.log('存储 refresh_token 成功');
  }

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

export const getPublicKey = async (): Promise<ApiResponse<{ publicKey: string }>> => {
  const response = await api.get('/auth/public-key');
  return response.data;
};

export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post('/auth/logout');

    // 清除本地存储的令牌和用户信息
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    console.log('登出成功，清除本地存储');

    return response.data;
  } catch (error) {
    console.error('登出失败:', error);

    // 即使接口调用失败，也要清除本地存储
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');

    throw error;
  }
};

export default api;