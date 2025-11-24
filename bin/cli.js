#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const { bold, green, cyan, red } = require('kleur');

async function main() {
  console.log(bold().cyan('\n🚀 Welcome to Yodogawa Slash Commands Installer!\n'));

  const response = await prompts({
    type: 'select',
    name: 'type',
    message: 'Which configuration would you like to install?',
    choices: [
      { title: 'Windsurf (.windsurf)', value: 'windsurf' },
      { title: 'Antigravity (.agent)', value: 'antigravity' },
      { title: 'Cursor (.cursor)', value: 'cursor' },
      { title: 'Claude Code (.claude)', value: 'claude' }
    ]
  });

  if (!response.type) {
    console.log(red('✖ Operation cancelled.'));
    process.exit(0);
  }

  // Determine source directory (where the package is installed)
  const sourceDir = path.join(__dirname, '..', '.windsurf');
  
  // Determine target directory (current working directory of the user)
  let targetDirName;
  if (response.type === 'windsurf') {
    targetDirName = '.windsurf';
  } else if (response.type === 'antigravity') {
    targetDirName = '.agent';
  } else if (response.type === 'cursor') {
    targetDirName = '.cursor';
  } else {
    targetDirName = '.claude';
  }
  
  const targetDir = path.join(process.cwd(), targetDirName);

  if (!fs.existsSync(sourceDir)) {
    console.error(red(`✖ Error: Source directory not found at ${sourceDir}`));
    console.error(red(`  Please ensure the package is installed correctly.`));
    process.exit(1);
  }

  try {
    if (fs.existsSync(targetDir)) {
      const confirm = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${targetDirName} already exists. Overwrite?`,
        initial: false
      });

      if (!confirm.overwrite) {
        console.log(red('✖ Operation cancelled.'));
        process.exit(0);
      }
    }

    console.log(`\nCopying workflows to ${bold(targetDirName)}...`);
    await fs.copy(sourceDir, targetDir);

    // Special handling for Cursor and Claude Code: rename workflows to commands
    if (response.type === 'cursor' || response.type === 'claude') {
      const workflowsDir = path.join(targetDir, 'workflows');
      const commandsDir = path.join(targetDir, 'commands');
      
      if (fs.existsSync(workflowsDir)) {
        console.log(`Renaming workflows to commands for ${response.type}...`);
        await fs.move(workflowsDir, commandsDir, { overwrite: true });
      }
    }
    
    console.log(green(`\n✔ Successfully installed ${response.type} workflows!`));
    console.log(`\nNext steps:`);
    console.log(`1. Open ${bold(targetDirName)} to explore the workflows.`);
    console.log(`2. Start using them in your project!\n`);
    
  } catch (err) {
    console.error(red(`\n✖ Error copying files: ${err.message}`));
    process.exit(1);
  }
}

main().catch(err => {
  console.error(red(err));
  process.exit(1);
});
