#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { createProject } from '../lib/create.js';

program
  .command('create <app-name>')
  .description('创建一个新项目')
  .option('-f, --force', '如果目标目录已存在，则覆盖')
  .action(async (name, cmd) => {
    try {
      await createProject(name, cmd.force);
    } catch (error) {
      console.error(chalk.red('创建项目失败：'), error);
    }
  });

program.on('--help', () => {
  console.log('');
  console.log(`运行 ${chalk.cyan('aii <command> --help')} 查看详细信息`);
  console.log('');
});

program.parse(process.argv);