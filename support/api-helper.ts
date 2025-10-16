import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class APIHelper {
  static instance: AxiosInstance | null = process.env.API_BASE_URL
    ? axios.create({
        baseURL: process.env.API_BASE_URL,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    : null;

  static async createUser(userData: any): Promise<any> {
    if (!this.instance) {
      // No API configured; return the input data as a fake response
      return { ...userData, id: 'local-' + Date.now() };
    }
    const response = await this.instance.post('/users', userData);
    return response.data;
  }

  static async deleteUser(userId: string): Promise<void> {
    if (!this.instance) return;
    await this.instance.delete(`/users/${userId}`);
  }

  static async login(username: string, password: string): Promise<any> {
    if (!this.instance) {
      // No API; return a fake token
      return { token: 'fake-token-' + Date.now(), id: 'local-' + Date.now() };
    }
    const response = await this.instance.post('/auth/login', {
      username,
      password
    });
    return response.data;
  }

  static async getUserById(userId: string): Promise<any> {
    if (!this.instance) return null;
    const response = await this.instance.get(`/users/${userId}`);
    return response.data;
  }
}
