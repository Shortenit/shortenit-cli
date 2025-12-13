import chalk from 'chalk';
import ora from 'ora';
import ApiService from '../services/ApiService';

class ExpandCommand {
  constructor(private apiService: ApiService) {}

  async execute(shortUrl: string): Promise<void> {
    console.log('');
    const spinner = ora('Fetching original URL...').start();

    try {
      // Extract short code from URL if full URL is provided
      let shortCode = shortUrl;
      if (shortUrl.includes('/')) {
        const parts = shortUrl.split('/');
        shortCode = parts[parts.length - 1];
      }

      const originalUrl = await this.apiService.expandUrl(shortCode);
      spinner.succeed('Original URL retrieved!');

      console.log('');
      console.log(chalk.bold('Original URL: '), chalk.cyan(originalUrl));
      console.log('');
    } catch (error: any) {
      spinner.fail('Failed to expand URL');
      if (error.response?.data?.error) {
        console.error(chalk.red(error.response.data.error));
      } else {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  }
}

export default ExpandCommand;
