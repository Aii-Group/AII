import { promisify } from "util";
import ora from "ora";
import download from "download-git-repo";
import fs from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";

const downloadRepo = promisify(download);

export async function createProject(projectName) {
  const targetDir = `./${projectName}`;
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`Directory ${projectName} already exists.`));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Please choose an action:",
        choices: [
          { name: "Overwrite directory", value: "overwrite" },
          { name: "Enter a different name", value: "rename" },
        ],
      },
    ]);

    if (action === "overwrite") {
      console.log(chalk.yellow(`Overwriting directory ${projectName}...`));
      await fs.remove(targetDir);
    } else if (action === "rename") {
      const { newName } = await inquirer.prompt([
        {
          type: "input",
          name: "newName",
          message: "Please enter a new project name:",
          validate: (input) => {
            if (!input) return "Project name cannot be empty!";
            if (fs.existsSync(`./${input}`))
              return "Directory already exists, please enter a different name!";
            return true;
          },
        },
      ]);
      projectName = newName;
      return createProject(projectName);
    }
  }

  const { template } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Please choose a project template:",
      choices: [
        { name: "AII Admin", value: "Aii-Group/AII-Admin-Cli#main" },
        {
          name: "AII Converged Platform",
          value: "Aii-Group/AII-Converged-Platform#main",
        },
        // { name: "AII Robot", value: "" },
      ],
    },
  ]);

  const spinner = ora(`Downloading template, please wait...`).start();
  try {
    spinner.text = `Downloading template, please wait...`;
    spinner.color = "yellow";
    await downloadRepo(template, targetDir);
    spinner.succeed(chalk.green("Template downloaded successfully!"));
  } catch (error) {
    spinner.fail(
      chalk.red(
        "Template download failed. Please check your network or the template URL."
      )
    );
    console.error(error);
    return;
  }

  const packageJsonPath = `${targetDir}/package.json`;
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = await fs.readJSON(packageJsonPath);
    packageJson.name = projectName;
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    console.log(chalk.green("⚒️  package.json has been updated!"));
  }

  console.log(chalk.green(`🎉 Project <${projectName}> created successfully!`));

  if (template === "Aii-Group/AII-Admin-Cli#main") {
    console.log(
      chalk.blue(`
           █████╗ ██╗██╗     █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
          ██╔══██╗██║██║    ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
          ███████║██║██║    ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
          ██╔══██║██║██║    ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
          ██║  ██║██║██║    ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
          ╚═╝  ╚═╝╚═╝╚═╝    ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝                                               
        `)
    );
  } else if (template === "Aii-Group/AII-Converged-Platform#main") {
    console.log(
      chalk.blue(`
           █████╗ ██╗██╗     ██████╗ ██████╗ ███╗   ██╗██╗   ██╗███████╗██████╗  ██████╗ ███████╗██████╗     ██████╗ ██╗      █████╗ ████████╗███████╗ ██████╗ ██████╗ ███╗   ███╗
          ██╔══██╗██║██║    ██╔════╝██╔═══██╗████╗  ██║██║   ██║██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔══██╗    ██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗████╗ ████║
          ███████║██║██║    ██║     ██║   ██║██╔██╗ ██║██║   ██║█████╗  ██████╔╝██║  ███╗█████╗  ██║  ██║    ██████╔╝██║     ███████║   ██║   █████╗  ██║   ██║██████╔╝██╔████╔██║
          ██╔══██║██║██║    ██║     ██║   ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║   ██║██╔══╝  ██║  ██║    ██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║
          ██║  ██║██║██║    ╚██████╗╚██████╔╝██║ ╚████║ ╚████╔╝ ███████╗██║  ██║╚██████╔╝███████╗██████╔╝    ██║     ███████╗██║  ██║   ██║   ██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║
          ╚═╝  ╚═╝╚═╝╚═╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═════╝     ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝                                                                                                                                                                          
        `)
    );
  } else if (template === "Aii-Group/AII-Robot#main") {
    console.log(
      chalk.blue(`
           █████╗ ██╗██╗    ██████╗  ██████╗ ██████╗  ██████╗ ████████╗
          ██╔══██╗██║██║    ██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗╚══██╔══╝
          ███████║██║██║    ██████╔╝██║   ██║██████╔╝██║   ██║   ██║   
          ██╔══██║██║██║    ██╔══██╗██║   ██║██╔══██╗██║   ██║   ██║   
          ██║  ██║██║██║    ██║  ██║╚██████╔╝██████╔╝╚██████╔╝   ██║   
          ╚═╝  ╚═╝╚═╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝                                                                
        `)
    );
  }

  // 提示用户后续操作
  console.log(
    chalk.blue(`✨ Please run the following commands to start development:`)
  );
  console.log(chalk.blue(`📂 cd ${projectName}`));
  console.log(chalk.blue(`📦 pnpm install`));
  console.log(chalk.blue(`⚡ pnpm run dev`));
}

export async function createPage(pageName) {
  const projectRoot = process.cwd();
  const pageDir = `${projectRoot}/src/pages/${pageName}`;
  const pagePath = `${pageDir}/index.tsx`;

  try {
    if (fs.existsSync(pageDir)) {
      console.log(chalk.red(`❌ Page directory "${pageName}" already exists.`));

      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "The page already exists. Please choose an action:",
          choices: [
            { name: "Overwrite the existing page", value: "overwrite" },
            { name: "Enter a different page name", value: "rename" },
          ],
        },
      ]);

      if (action === "overwrite") {
        console.log(chalk.yellow(`Overwriting the existing page "${pageName}"...`));
        await fs.remove(pageDir);
      } else if (action === "rename") {
        const { newName } = await inquirer.prompt([
          {
            type: "input",
            name: "newName",
            message: "Please enter a new page name:",
            validate: (input) => {
              if (!input) return "Page name cannot be empty!";
              if (fs.existsSync(`${projectRoot}/src/pages/${input}`))
                return "Page directory already exists, please enter a different name!";
              return true;
            },
          },
        ]);
        pageName = newName;
        return createPage(pageName);
      }
    }

    await fs.ensureDir(pageDir);

    const pageContent = `
      import React from 'react';

      const ${pageName}: React.FC = () => {
        return (
          <div>
            <h1>Welcome to ${pageName} page</h1>
          </div>
        );
      };

      export default ${pageName};
    `;

    await fs.writeFile(pagePath, pageContent.trim(), "utf8");
    console.log(chalk.green(`🎉 Page "${pageName}" created successfully at ${pagePath}!`));
  } catch (error) {
    console.error(chalk.red(`❌ Failed to create page "${pageName}".`));
    console.error(error);
  }
}
