#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { createProject, createPage } from '../lib/create.js';

program
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

program
 .command('add <page-name>')
 .description('Add a new page')
 .option('-f, --force', 'If the target page already exists, it will be overwritten.')
 .action(async (name, cmd) => {
    try {
      await createPage(name, cmd.force);
    } catch (error) {
      console.error(chalk.red('Failed to create page:'), error);
    }
 })

program.on('--help', () => {
  console.log('');
  console.log(`Run ${chalk.cyan('aii <command> --help')} view details`);
  console.log('');
});

program.parse(process.argv);