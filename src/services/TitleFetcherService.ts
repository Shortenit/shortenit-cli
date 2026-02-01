import axios from 'axios';
import * as cheerio from 'cheerio';

class TitleFetcherService {
  async fetchTitle(url: string): Promise<string> {
    try {
      // Fetch the HTML content
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ShortenitCLI/1.0)',
        },
      });

      // Parse HTML and extract title
      const $ = cheerio.load(response.data);
      const title = $('head > title').text().trim();

      if (!title) {
        throw new Error('No title found on the page');
      }

      return title;
    } catch (error: any) {
      // Re-throw with a more helpful message
      if (error.message === 'No title found on the page') {
        throw error;
      }
      throw new Error(`Failed to fetch page title: ${error.message}`);
    }
  }
}

export default TitleFetcherService;
