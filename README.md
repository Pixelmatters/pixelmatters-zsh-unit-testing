<p align="center">
    <img width="80" src="./img/pixelmatters-logo.jpeg" />
</p>

<p align="center">
    <img src="./img/pixelmatters-name.svg" />
</p>

<h1 align="center">
  pixelmatters-zsh-unit-testing
</h1>

<h3 align="center">
  CLI that adds useful custom ZSH functions for your unit testing
</h3>

<p align="center">
  It adds functions to only run unit tests on files that are different between two branches or on changed files that haven't yet been commited; 
</p>

<p align="center">
  <a href="https://github.com/Pixelmatters/pixelmatters-zsh-unit-testing/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="pixelmatters-zsh-unit-testing is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.com/package/@jagoncalves14/jagoncalves14-zsh-unit-testing">
    <img src="https://img.shields.io/npm/v/@pixelmatters/pixelmatters-zsh-unit-testing.svg" alt="Current npm package version." />
  </a>
  <a href="https://github.com/Pixelmatters/pixelmatters-zsh-unit-testing/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=pixelmatters_">
    <img src="https://img.shields.io/twitter/follow/pixelmatters_.svg?label=Follow%20@pixelmatters_" alt="Follow @pixelmatters_" />
  </a>
</p>

## 🚀 Get Up and Running

You can install this package using either **npm** or **yarn**.

### **Yarn**

If using Yarn:

1. Install the package globally

```shell
yarn global add @jagoncalves14/pixelmatters-zsh-unit-testing
```

### **NPM**

If using NPM:

1. Install the package as a development dependency::

```shell
npm install -g @jagoncalves14/pixelmatters-zsh-unit-testing
```

At this point you should be good to go 👍

## 🤝 Usage

1. After installing, run the package's CLI command and answer to the questions in the prompt:

```shell
pixelmatters-zsh-unit-testing
```

2. Now you're all set and done!

After the CLI command is complete, the following functions are added to you .zshrc config:

- testchanges
- testbranch

## Examples

### testchanges

- Run unit tests on changed files:

```shell
testchanges
```

- Run unit tests on changed files and update its snapshots:

```shell
testchanges -u
```

### testbranch

- Run unit tests on different files between current and target branch:

```shell
testbranch
```

- Run unit tests on different files between current and target branch and update its snapshots:

```shell
testbranch -u
```

- Run unit tests on different files between current and custom target branch:

```shell
testbranch fix/some-branch-name
```

- Run unit tests on different files between current and custom target branch:

```shell
testbranch -u fix/some-branch-name
```

## 🤝 How to Contribute

Whether you're helping us fix bugs, improve the docs, or spread the word, thank you! 💪 🧡 💙

Check out our [**Contributing Guide**](https://github.com/Pixelmatters/pixelmatters-zsh-unit-testing/blob/main/CONTRIBUTING.md) for ideas on contributing and setup steps.

## :memo: License

Licensed under the [MIT License](./LICENSE).
