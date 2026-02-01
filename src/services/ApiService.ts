import axios, { AxiosInstance } from 'axios';
import https from 'https';
import ConfigManager from '../config/ConfigManager';

interface UrlResponse {
  originalUrl: string;
  code: string;
  shortUrl: string;
  title: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

class ApiService {
  private client: AxiosInstance;
  private configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;

    const httpsAgent = new https.Agent();

    this.client = axios.create({
      baseURL: configManager.getBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configManager.getApiKey(),
      },
      httpsAgent,
    });
  }

  async shortenUrl(originalUrl: string, title: string, code?: string, expirationDays?: string): Promise<UrlResponse> {
    const response = await this.client.post('/api/urls', {
      originalUrl,
      title,
      code,
      expirationDays,
    });
    return response.data;
  }

  async expandUrl(shortCode: string): Promise<UrlResponse> {
    const response = await this.client.get(`/api/urls/${shortCode}`);
    return response.data;
  }

  async deleteUrl(shortCode: string): Promise<void> {
    await this.client.delete(`/api/urls/${shortCode}`);
  }

  async listUrls(): Promise<UrlResponse[]> {
    const response = await this.client.get(`/api/urls?page=0&size=10`);
    return Array.isArray(response.data) ? response.data : response.data.content || [];
  }

  async listAllUrls(): Promise<UrlResponse[]> {
    const response = await this.client.get(`/api/urls`);
    return Array.isArray(response.data) ? response.data : response.data.content || [];
  }
}

export default ApiService;
