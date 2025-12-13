import chalk from 'chalk';
import ora from 'ora';
import ApiService from '../services/ApiService';

interface ShortCommandOptions {
  customAlias?: string;
}

class ShortCommand {
  constructor(
    private apiService: ApiService,
  ) { }

  async execute(longUrl: string, options: ShortCommandOptions): Promise<void> {
    console.log('');
    const spinner = ora('Creating shortened link...').start();

    try {
      const result = await this.apiService.shortenUrl(longUrl, options.customAlias);
      spinner.succeed('Link shortened successfully!');

      console.log('');
      console.log(chalk.bold('Short URL:   '), chalk.green(result.shortUrl));
      console.log('');

    } catch (error: any) {
      spinner.fail('Failed to shorten URL');
      if (error.response?.data?.error) {
        console.error(chalk.red(error.response.data.error));
      } else {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  }
}

export default ShortCommand;
