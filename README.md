<a href="https://klave.com/">
  <img alt="Klave - Wallet" src="https://klave.com/images/marketplace/krc20.png">
  <h1 align="center">Manage securely your cryptographic keys on Klave</h1>
</a>

<p align="center">
  An implementation on Klave of a Wallet to manage cryptographic keys and external owned account for the web3 ecosystem.
</p>

<p align="center">
  <a href="#description"><strong>Description</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#build-locally"><strong>Build Locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>

![Wasm](https://img.shields.io/badge/Webassembly-5E4EE3?style=for-the-badge&labelColor=white&logo=webassembly&logoColor=5E4EE3) ![AssemblyScript](https://img.shields.io/badge/Assemblyscript-3578C7?style=for-the-badge&labelColor=white&logo=assemblyscript&logoColor=3578C7)

## Description

Wallet are used to store and manage securely cryptographic keys that are needed to sign transaction and payload.

The basic Klave wallet provides the following functions:

- Create, delete ECDSA and AES Keys
- Sign, Verify, Encrypt, Decrypt
- Access management

## Features

- **Create Wallet:** Create your Wallet
- **Manage cryptographic keys lifecycle:** Create, delete and use your cryptographic keys
- **Sign and Verify:** Create and verify signature
- **Encrypt and decrypt:** Encrypt message and Decrypt cypher with your keys

## Deploy Your Own

You can deploy your own version of the Klave wallet with one click:

[![Deploy on Klave](https://klave.com/images/deploy-on-klave.svg)](https://app.klave.com/template/github/secretarium/klave-basic-wallet)

## Build Locally

You can build your into wasm locally, allowing you to validate the hash of the application deployed on Klave.

> Note: You should have node and yarn installed to be able to build locally.

```bash
yarn install
yarn build
```
This will create the .wasm file in the ./klave folder.

## Authors

This library is created by [Klave](https://klave.com) and [Secretarium](https://secretarium.com) team members, with contributions from:

- Jeremie Labbe ([@jlabbeklavo](https://github.com/jlabbeKlavo)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
- Nicolas Marie ([@Akhilleus20](https://github.com/Akhilleus20)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
- Etienne Bosse ([@Gosu14](https://github.com/Gosu14)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)