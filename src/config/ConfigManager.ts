import Conf from 'conf';
import inquirer from 'inquirer';
import chalk from 'chalk';

interface ConfigSchema {
  apiKey: string;
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
    return this.config.has('apiKey') && this.config.has('baseUrl');
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
        },
        {
          type: 'input',
          name: 'apiKey',
          message: 'Enter your API key:',
          validate: (input: string) => {
            if (input.trim().length === 0) {
              return 'API key cannot be empty';
            }
            return true;
          },
        }
      ]);
      this.config.set('apiKey', answers.apiKey);
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

  getApiKey(): string {
    return this.config.get('apiKey') || '';
  }

  getBaseUrl(): string {
    return this.config.get('baseUrl') || '';
  }

  resetConfig(): void {
    this.config.clear();
    console.log(chalk.green('\n Configuration cleared successfully!\n'));
  }

  showConfig(): void {
    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();

    console.log(chalk.bold('\n Current Configuration:'));
    console.log(chalk.cyan(' Base URL:'), baseUrl || 'Not set');
    console.log(chalk.cyan(' API Key:'), apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set');
    console.log('');
  }
}

export default ConfigManager;
