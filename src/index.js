#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { createProject } from './lib/create.js';

// 定义命令
program
  .version('1.0.0')
  .description('AII CLI - 快速搭建脚手架项目')
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

// 添加帮助信息
program.on('--help', () => {
  console.log('');
  console.log(`运行 ${chalk.cyan('aii <command> --help')} 查看详细信息`);
  console.log('');
});

// 解析命令行参数
program.parse(process.argv);