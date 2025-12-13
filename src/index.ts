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

const packageJson = require('../package.json');

const program = new Command();
const configManager = new ConfigManager();

async function main() {
  program
    .name('shortenit')
    .description('CLI tool for Shortenit URL shortener')
    .version(packageJson.version);

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
