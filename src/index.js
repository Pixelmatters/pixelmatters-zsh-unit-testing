#!/usr/bin/env node

const { exec } = require('child_process');
const inquirer = require('inquirer')
const fs = require('fs')
const os = require('os')
const path = require('path')


// Determine the Shell
const envShell = process.env.SHELL;
let userShell
if (envShell) {
  if (envShell.includes('bash')) {
    userShell = 'bash'
  } else if (envShell.includes('zsh')) {
    userShell = 'zsh'
  } else {
    return console.log('User is using an unsupported shell.');
  }
}

const userHomeDir = os.homedir()
const shellConfigFilePath = `${userHomeDir}/.${userShell}rc`

const collectInformation = async () => {
  let response
  await inquirer.prompt([
    {
      type: 'input',
      name: 'testRunner',
      message: 'What command you use for running unit tests?',
      default: 'pnpm run test:unit',
    },
    {
      type: 'list',
      name: 'targetBranch',
      message: 'What should be the default branch you want to compare with?',
      choices: ['main', 'master', 'other'],
    },
  ])
  .then(async (answers) => {
    response = answers

    if (answers.targetBranch === 'other') {
      await inquirer.prompt([
        {
          type: 'input',
          name: 'targetBranch',
        },
      ]).then((answers) => {
        response = {
          ...response,
          ...answers
        }
      })
    }
  })
  
  return response
}

const getTestChangesFn = (answers) => {
  let data
  try {
    data = fs.readFileSync(path.resolve(__dirname, './functions/testChanges.sh'), 'utf8')
  } catch (err) {
    throw Error(err)
  }
  
  data = data.replace(new RegExp('@testRunner', 'g'), answers.testRunner)
  return data
}

const getTestBranchFn = (answers) => {
  let data
  try {
    data = fs.readFileSync(path.resolve(__dirname, './functions/testBranch.sh'), 'utf8')
  } catch (err) {
    throw Error(err)
  }
  
  data = data.replace(new RegExp('@testRunner', 'g'), answers.testRunner)
  data = data.replace(new RegExp('@targetBranch', 'g'), answers.targetBranch)
  return data
}

const getShellConfigFileData = () => {
  let data
  try {
    data = fs.readFileSync(shellConfigFilePath, 'utf8')
  } catch (err) {
    throw Error(err)
  }

  return data
}

const updateShellConfigFileData = (content) => {
  try {
    fs.writeFileSync(shellConfigFilePath, content)
  } catch (err) {
    throw Error(err)
  }
}

const init = async () => {
  const answers = await collectInformation()
  const testChangesFn = await getTestChangesFn(answers)
  const testBranchFn = await getTestBranchFn(answers)
  
  let shellConfigFileData = await getShellConfigFileData()
  let oldTestChangesFn = shellConfigFileData.match(/function testchanges(\s|\S)*?}/)

  if (oldTestChangesFn) {
    shellConfigFileData = shellConfigFileData.replace(oldTestChangesFn.join(''), testChangesFn)
  } else {
    shellConfigFileData = `${shellConfigFileData}\n\n${testChangesFn}`
  }

  let oldTestBranchFn = shellConfigFileData.match(/function testbranch(\s|\S)*?}/)
  if (oldTestBranchFn) {
    shellConfigFileData = shellConfigFileData.replace(oldTestBranchFn.join(''), testBranchFn)
  } else {
    shellConfigFileData = `${shellConfigFileData}\n\n${testBranchFn}`
  }

  console.log(shellConfigFileData)

  await updateShellConfigFileData(shellConfigFileData)

  // Execute `source` to update the shell config
  exec(`source ~/.${userShell}rc`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing 'source ~/.${userShell}rc': ${error.message}`);
        return;
    }
    console.log(`'source ~/.${userShell}rc' executed successfully`);
  });
  
  console.log(`
    You're done! 🎉

    The following functions were added to you .${userShell}rc config:
        - testchanges
        - testbranch

    Usage:
        testchanges [-u]
        testbranch [-u <targetbranch>]
    
    Examples:
      # testchanges
        - Run unit tests on changed files:
        $ > testchanges

        - Run unit tests on changed files and update its snapshots:
        $ > testchanges -u

      # testbranch
        - Run unit tests on different files between current and target branch:
        $ > testbranch

        - Run unit tests on different files between current and target branch and update its snapshots:
        $ > testbranch -u

        - Run unit tests on different files between current and custom target branch:
        $ > testbranch fix/some-branch-name

        - Run unit tests on different files between current and custom target branch:
        $ > testbranch -u fix/some-branch-name
        
      For more comprehensive help, go to: 
      https://www.npmjs.com/package/@jagoncalves14/pixelmatters-zsh-unit-testing
    `);
}

init()

module.exports = init
