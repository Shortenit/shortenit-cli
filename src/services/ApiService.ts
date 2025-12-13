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
      },
      httpsAgent,
    });
  }

  async shortenUrl(originalUrl: string): Promise<ShortenUrlResponse> {
    const response = await this.client.post('/api/shorten', {
      originalUrl,
    });
    return response.data;
  }
}

export default ApiService;
