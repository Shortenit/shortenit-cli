import axios, { AxiosInstance } from 'axios';
import https from 'https';
import ConfigManager from '../config/ConfigManager';

interface ShortenUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
  customAlias?: string;
}

interface UrlItem {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
  customAlias?: string;
  isExpired: boolean;
}

interface UrlRecentResponse {
  content: UrlItem[];
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

  async shortenUrl(originalUrl: string, customAlias?: string, expirationDays?: string): Promise<ShortenUrlResponse> {
    const response = await this.client.post('/api/shorten', {
      originalUrl,
      customAlias,
      expirationDays,
    });
    return response.data;
  }

  async expandUrl(shortCode: string): Promise<string> {
    const response = await this.client.get(`/api/urls/${shortCode}`);
    return response.data.originalUrl;
  }

  async deleteUrl(shortCode: string): Promise<void> {
    await this.client.delete(`/api/urls/${shortCode}`);
  }

  async listUrls(): Promise<UrlRecentResponse> {
    const response = await this.client.get(`/api/urls/recent`);
    return response.data;
  }

  async listAllUrls(): Promise<UrlItem[]> {
    const response = await this.client.get(`/api/urls/all`);
    return Array.isArray(response.data) ? response.data : response.data.content || [];
  }
}

export default ApiService;
