import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import ApiService from '../services/ApiService';

class ListCommand {
  constructor(private apiService: ApiService) {}

  async execute(showAll: boolean = false): Promise<void> {
    console.log('');
    const spinner = ora('Fetching URLs...').start();

    try {
      let urls;
      if (showAll) {
        urls = (await this.apiService.listAllUrls()).reverse();
        spinner.succeed(`Retrieved all ${urls.length} URLs`);
      } else {
        const response = await this.apiService.listUrls();
        urls = response.content;
        spinner.succeed(`Retrieved recent ${urls.length} URLs`);
      }

      if (urls.length === 0) {
        console.log(chalk.yellow('\nNo URLs found. Create one with: shortenit short <url>\n'));
        return;
      }

      console.log('');

      const tableData = [
        [
          chalk.bold('Short Code'),
          chalk.bold('Original URL'),
          chalk.bold('Clicks'),
          chalk.bold('Created At'),
        ],
      ];

      for (const url of urls) {
        const originalUrl = url.originalUrl.length > 50 
          ? url.originalUrl.substring(0, 47) + '...' 
          : url.originalUrl;
        const createdAt = new Date(url.createdAt).toLocaleDateString('en-GB');

        tableData.push([
          chalk.cyan(url.shortCode),
          originalUrl,
          chalk.yellow((url.clickCount || 0).toString()),
          createdAt,
        ]);
      }

      console.log(table(tableData));

      if (!showAll) {
        console.log(chalk.dim('💡 Use "shortenit list-all" to see all URLs\n'));
      }
    } catch (error: any) {
      spinner.fail('Failed to fetch URLs');
      if (error.response?.data?.error) {
        console.error(chalk.red(error.response.data.error));
      } else {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  }
}

export default ListCommand;
