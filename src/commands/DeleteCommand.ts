import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import ApiService from '../services/ApiService';

class DeleteCommand {
  constructor(private apiService: ApiService) {}

  async execute(shortCodeOrUrl: string): Promise<void> {
    console.log('');
    // Extract short code from URL if full URL is provided
    let shortCode = shortCodeOrUrl;
    if (shortCodeOrUrl.includes('/')) {
      const parts = shortCodeOrUrl.split('/');
      shortCode = parts[parts.length - 1];
    }

    try {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to delete the short URL "${shortCode}"?`,
          default: false,
        },
      ]);

      if (!answers.confirm) {
        console.log(chalk.yellow('\n Deletion cancelled.\n'));
        return;
      }
    } catch (error) {
      // Check if the error is the specific "Force Closed" error
      if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n Deletion cancelled.\n'));
        process.exit(0); // Exit cleanly
      } else {
        throw error;
      }
    }

    const spinner = ora('Deleting URL...').start();

    try {
      await this.apiService.deleteUrl(shortCode);
      spinner.succeed(chalk.green(`URL "${shortCode}" deleted successfully!`));
      console.log('');
    } catch (error: any) {
      spinner.fail('Failed to delete URL');
      if (error.response?.data?.error) {
        console.error(chalk.red(error.response.data.error));
      } else if (error.response?.status === 404) {
        console.error(chalk.red('URL not found or you do not have permission to delete it\n'));
      } else {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  }
}

export default DeleteCommand;
