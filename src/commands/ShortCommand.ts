import chalk from 'chalk';
import ora from 'ora';
import ApiService from '../services/ApiService';
import QRCodeService from '../services/QRCodeService';
import TitleFetcherService from '../services/TitleFetcherService';

interface ShortCommandOptions {
  customAlias?: string;
  expirationDays?: string;
  printQr?: boolean;
  saveQr?: boolean;
}

class ShortCommand {
  constructor(
    private apiService: ApiService,
    private qrService: QRCodeService,
    private titleFetcher: TitleFetcherService
  ) { }

  async execute(longUrl: string, options: ShortCommandOptions): Promise<void> {
    console.log('');

    // Fetch the title first
    const titleSpinner = ora('Fetching page title...').start();
    let title: string;

    try {
      title = await this.titleFetcher.fetchTitle(longUrl);
      titleSpinner.succeed();
    } catch (error: any) {
      titleSpinner.fail('Failed to fetch page title');
      console.error(chalk.red(error.message));
      process.exit(1);
    }

    const spinner = ora('Creating shortened link...').start();

    try {
      const result = await this.apiService.shortenUrl(longUrl, title, options.customAlias, options.expirationDays);
      spinner.succeed('Link shortened successfully!');

      console.log('');
      console.log(chalk.bold('Short URL:   '), chalk.green(result.shortUrl));
      console.log(chalk.bold('Title:       '), chalk.green(result.title));
      if (result.expiresAt != null) {
        const expiresDate = new Date(result.expiresAt);
        const formattedDate = expiresDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const formattedTime = expiresDate.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        console.log(chalk.bold('Expires At:  '), chalk.green(`${formattedDate} at ${formattedTime}`));
      }
      console.log('');

      if (options.printQr) {
        await this.qrService.printToTerminal(result.shortUrl);
      }

      if (options.saveQr) {
        const spinner2 = ora('Saving QR code...').start();
        const filepath = await this.qrService.saveToDownloads(result.shortUrl, result.code);
        spinner2.succeed(`QR code saved to: ${chalk.cyan(filepath)}\n`);
      }

    } catch (error: any) {
      spinner.fail('Failed to shorten URL');
      if (error.response?.data?.error) {
        console.error(chalk.red(error.response.data.error));
      } else if (error.response?.status === 409) {
        console.error(chalk.red('Custom alias already exists\n'));
      } else {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  }
}

export default ShortCommand;
