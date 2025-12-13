#!/usr/bin/env node

const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

if (majorVersion < 24) {
  console.error(`Node.js version ${nodeVersion} is not supported. Please use Node.js 24 or higher.`);
  process.exit(1);
}

import { Command } from 'commander';
import chalk from 'chalk';
import ConfigManager from './config/ConfigManager';
import ApiService from './services/ApiService'
import QRCodeService from './services/QRCodeService'
import ShortCommand from './commands/ShortCommand'
import ExpandCommand from './commands/ExpandCommand'

const packageJson = require('../package.json');

const program = new Command();
const configManager = new ConfigManager();

async function main() {
  program
    .name('shortenit')
    .description('CLI tool for Shortenit URL shortener')
    .version(packageJson.version);

  // Short command
  program
    .command('short <url>')
    .description('Create a shortened link')
    .option('-c, --custom-alias <string>', 'Custom alias for the short URL')
    .option('-e, --expiration-days <number>', 'Number of days until expiration')
    .option('-p, --print-qr', 'Print QR code to terminal')
    .option('-s, --save-qr', 'Save QR code to Downloads folder')
    .action(async (url: string, options: any) => {
      await configManager.ensureConfigured();
      const apiService = new ApiService(configManager);
      const qrService = new QRCodeService();
      const command = new ShortCommand(apiService, qrService);
      await command.execute(url, options);
    });

  // Expand command
  program
    .command('expand <url>')
    .description('Get the original URL from a shortened link')
    .action(async (shortUrl: string) => {
      await configManager.ensureConfigured();
      const apiService = new ApiService(configManager);
      const command = new ExpandCommand(apiService);
      await command.execute(shortUrl);
    });

  // Config command
  program
    .command('config')
    .description('Manage configuration')
    .option('--reset', 'Reset configuration')
    .option('--show', 'Show current configuration')
    .action(async (options: any) => {
      if (options.reset) {
        configManager.resetConfig();
      } else if (options.show) {
        configManager.showConfig();
      } else {
        await configManager.setupConfig();
      }
    });

  // Check if no arguments provided before parsing
  if (!process.argv.slice(2).length) {
    // Prompt for config if not configured
    if (!configManager.isConfigured()) {
      await configManager.ensureConfigured();
      process.exit(0);
    }
    program.outputHelp();
    process.exit(0);
  }

  // Parse arguments
  program.parse(process.argv);
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
