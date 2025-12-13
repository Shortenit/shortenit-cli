import Conf from 'conf';
import inquirer from 'inquirer';
import chalk from 'chalk';

interface ConfigSchema {
  baseUrl: string;
}

class ConfigManager {
  private config: Conf<ConfigSchema>;

  constructor() {
    this.config = new Conf<ConfigSchema>({
      projectName: 'shortenit-cli',
    });
  }

  isConfigured(): boolean {
    return this.config.has('baseUrl');
  }

  async ensureConfigured(): Promise<void> {
    if (!this.isConfigured()) {
      console.log(chalk.yellow('\n First time setup required!'));
      await this.setupConfig();
    }
  }

  async setupConfig(): Promise<void> {
    try {
      this.showConfig();
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: 'Enter your Shortenit backend URL:',
          default: 'http://localhost:8080',
          validate: (input: string) => {
            try {
              new URL(input);
              return true;
            } catch {
              return 'Please enter a valid URL';
            }
          },
        }
      ]);
      this.config.set('baseUrl', answers.baseUrl.replace(/\/$/, '')); // Remove trailing slash
      console.log(chalk.green('\n Configuration saved successfully!\n'));
    } catch (error) {
      // Check if the error is the specific "Force Closed" error
      if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n Configuration cancelled.\n'));
        process.exit(0); // Exit cleanly
      } else {
        throw error;
      }
    }
  }

  getBaseUrl(): string {
    return this.config.get('baseUrl') || '';
  }

  resetConfig(): void {
    this.config.clear();
    console.log(chalk.green('\n Configuration cleared successfully!\n'));
  }

  showConfig(): void {
    const baseUrl = this.getBaseUrl();

    console.log(chalk.bold('\n Current Configuration:'));
    console.log(chalk.cyan(' Base URL:'), baseUrl || 'Not set');
    console.log('');
  }
}

export default ConfigManager;
