#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { createProject } from './lib/create.js';

program
  .version('1.0.0')
  .description('AII CLI - Quickly build scaffolding projects')
  .command('create <app-name>')
  .description('Create a new project')
  .option('-f, --force', 'If the destination directory already exists, it will be overwritten.')
  .action(async (name, cmd) => {
    try {
      await createProject(name, cmd.force);
    } catch (error) {
      console.error(chalk.red('Failed to create project:'), error);
    }
  });

program.on('--help', () => {
  console.log('');
  console.log(`run ${chalk.cyan('aii <command> --help')} view details`);
  console.log('');
});

program.parse(process.argv);