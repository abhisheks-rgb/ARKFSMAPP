/**
 * HttpClient — Axios wrapper with token injection + error mapping.
 * path: src/infrastructure/network/HttpClient.ts
 *
 * Requires: npm install axios
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {API_CONFIG} from '../../shared/config/ApiConfig';
import {TokenStorage} from '../../shared/config/TokenStorage';
import {AppError} from '../../domain/errors/AppError';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.API_BASE,
      timeout: API_CONFIG.TIMEOUT,
      headers: {...API_CONFIG.DEFAULT_HEADERS},
    });
    this.addRequestInterceptor();
    this.addResponseInterceptor();
  }

  private addRequestInterceptor() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await TokenStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      err => Promise.reject(err),
    );
  }

  private addResponseInterceptor() {
    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      async (err: any) => {
        const status:  number = err?.response?.status;
        const message: string = err?.response?.data?.message ?? err?.message ?? 'Unknown error';

        if (status === 401) {
          await TokenStorage.clearAll();
          return Promise.reject(AppError.tokenExpired());
        }
        if (status === 404) return Promise.reject(AppError.notFound(message));
        if (status >= 500)  return Promise.reject(AppError.server(message));
        if (!err.response)  return Promise.reject(AppError.network(message));
        return Promise.reject(AppError.unknown(err));
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, config);
    return res.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<T>(url, data, config);
    return res.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<T>(url, data, config);
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, config);
    return res.data;
  }
}

export const httpClient = new HttpClient();