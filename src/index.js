#!/usr/bin/env node

const inquirer = require('inquirer')
const fs = require('fs')
const os = require('os')
const path = require('path')

const userHomeDir = os.homedir()
const collectInformation = async () => {
  let response
  await inquirer.prompt([
    {
      type: 'list',
      name: 'testRunner',
      message: 'What unit test framework do you use?',
      choices: ['jest', 'vitest'],
      filter(val) {
        if (val === 'vitest') {
          return `${val} run`
        } else {
          return val
        }
      },
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

const getZshrcFile = () => {
  let data
  try {
    const zshrcPath = `${userHomeDir}/.zshrc`
    data = fs.readFileSync(zshrcPath, 'utf8')
  } catch (err) {
    throw Error(err)
  }

  return data
}

const updateZshrcFile = (content) => {
  try {
    fs.writeFileSync(`${userHomeDir}/.zshrc`, content)
  } catch (err) {
    throw Error(err)
  }
}

const init = async () => {
  const answers = await collectInformation()
  const testChangesFn = await getTestChangesFn(answers)
  const testBranchFn = await getTestBranchFn(answers)
  
  let zshrcFile = await getZshrcFile()
  let oldTestChangesFn = zshrcFile.match(/function testchanges([\s\S]*)}/mg)

  if (oldTestChangesFn) {
    oldTestChangesFn.join()
    zshrcFile = zshrcFile.replace(oldTestChangesFn, testChangesFn)
  } else {
    zshrcFile = `${zshrcFile}\n\n${testChangesFn}`
  }

  let oldTestBranchFn = zshrcFile.match(/function testbranch([\s\S]*)}/mg)
  if (oldTestBranchFn) {
    oldTestBranchFn.join()
    zshrcFile = zshrcFile.replace(oldTestBranchFn, testBranchFn)
  } else {
    zshrcFile = `${zshrcFile}\n\n${testBranchFn}`
  }
  await updateZshrcFile(zshrcFile)

  
  console.log(`
    You're done! 🎉

    The following functions were added to you .zshrc config:
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
      https://www.npmjs.com/package/@jagoncalves14/unit-tests-addon
    `);
}

init()

module.exports = init
