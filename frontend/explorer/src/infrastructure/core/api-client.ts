// src/infrastructure/core/api-client.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
    });

    // Request Interceptor (auth, logging, etc)
    this.client.interceptors.request.use((config) => {
      // contoh tambahkan token jika ada
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response Interceptor (global error handling)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Bisa custom error handling disini
        const message = error.response?.data?.message || error.message;
        return Promise.reject(new Error(message));
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.get(url, config);
    return res.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.post(url, data, config);
    return res.data;
  }
}
