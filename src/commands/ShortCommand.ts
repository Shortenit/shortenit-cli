import chalk from 'chalk';
import ora from 'ora';
import ApiService from '../services/ApiService';
import QRCodeService from '../services/QRCodeService';

interface ShortCommandOptions {
  customAlias?: string;
  expirationDays?: string;
  printQr?: boolean;
  saveQr?: boolean;
}

class ShortCommand {
  constructor(
    private apiService: ApiService,
    private qrService: QRCodeService
  ) { }

  async execute(longUrl: string, options: ShortCommandOptions): Promise<void> {
    console.log('');
    const spinner = ora('Creating shortened link...').start();

    try {
      const result = await this.apiService.shortenUrl(longUrl, options.customAlias, options.expirationDays);
      spinner.succeed('Link shortened successfully!');

      console.log('');
      console.log(chalk.bold('Short URL:   '), chalk.green(result.shortUrl));
      if (result.expiresAt != null) {
        console.log(chalk.bold('Expires At:  '), chalk.green(result.expiresAt));
      }
      console.log('');

      if (options.printQr) {
        await this.qrService.printToTerminal(result.shortUrl);
      }

      if (options.saveQr) {
        const spinner2 = ora('Saving QR code...').start();
        const filepath = await this.qrService.saveToDownloads(result.shortUrl, result.shortCode);
        spinner2.succeed(`QR code saved to: ${chalk.cyan(filepath)}\n`);
      }


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
