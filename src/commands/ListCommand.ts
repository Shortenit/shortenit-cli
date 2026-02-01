import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import ApiService from '../services/ApiService';

class ListCommand {
  constructor(private apiService: ApiService) { }

  async execute(showAll: boolean = false): Promise<void> {
    console.log('');
    const spinner = ora('Fetching URLs...').start();

    try {
      let urls;
      if (showAll) {
        urls = await this.apiService.listAllUrls();
        spinner.succeed(`Retrieved all ${urls.length} URLs`);
      } else {
        urls = await this.apiService.listUrls();
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
          chalk.bold('Title'),
          chalk.bold('Clicks'),
          chalk.bold('Created At'),
          chalk.bold('Active')
        ],
      ];

      for (const url of urls) {
        const createdAt = new Date(url.createdAt).toLocaleDateString('en-GB');

        tableData.push([
          chalk.cyan(url.code),
          url.title,
          chalk.yellow((url.clickCount || 0).toString()),
          createdAt,
          url.isActive.toString(),
        ]);
      }

      const config = {
        columns: {
          0: { width: 10, wrapWord: true },  // Short Code
          1: { width: 50, wrapWord: true },  // Title - wrap long text
          2: { width: 6 },  // Clicks
          3: { width: 10 },  // Created At
          4: { width: 6 },  // Active
        },
      };

      console.log(table(tableData, config));

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
