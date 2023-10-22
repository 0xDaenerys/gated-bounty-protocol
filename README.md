<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h1 align="center">Gated Bounty Protocol</h1>

  <p align="center">
    <a href="https://gated-bounty-protocol-frontend.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/0xDaenerys/gated-bounty-protocol/issues">Report Bug</a>
    ·
    <a href="https://github.com/0xDaenerys/gated-bounty-protocol/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
# About The Project
Welcome to the Gated Bounty Protocol (GBP), an advanced and community-friendly bounty protocol designed to support various gating mechanisms for both developers and bounty creators. GBP enhances the bounty ecosystem by allowing the verification of users through mechanisms such as verified soulbound NFTs and reputation ERC20 tokens. This added layer of security and verification ensures a more trustworthy and flexible platform.

GBP is adaptable and can facilitate a wide range of protocols for different communities, making it suitable for platforms like Gitcoin, audit competition protocols, and various game theories.

### Key Components
GBP consists of two main components: Contracts and Frontend.

## Contracts
The contracts form the backbone of the Gated Bounty Protocol. These contracts are responsible for managing and executing various functionalities of the platform.

**ERC20 Contract for Reputation Tokens**: This contract manages reputation tokens, which are used to verify and validate users within the GBP ecosystem. Users may need a specific amount of reputation tokens to participate in bounties.

**ERC721 Contract for KYH (Know Your Hacker) Soulbound NFT**: This contract handles the issuance and management of soulbound NFTs, which are crucial for verifying the identity of participants.

**Factory Contract**: The factory contract plays a central role in deploying other contracts within the GBP ecosystem. It helps create instances of the bounty contract when a new bounty is initiated on the platform.

**Bounty Contract**: The bounty contract is created for each new bounty initiated on the platform. It manages the specific requirements, rules, and rewards for that bounty.

## Frontend
The frontend is a decentralized application (dApp) created using React. It provides a user-friendly interface for interacting with the Gated Bounty Protocol. The frontend leverages the Push Protocol, offering various decentralized communication features, including:

**Wallet-to-Wallet Notifications**: Users receive notifications related to their bounties and interactions within the GBP ecosystem.

**Gated Decentralized Group Chats**: The platform supports group chats where users can discuss and collaborate on bounties, leveraging the security of gating mechanisms.

**Push Spaces for a Bounty**: Users can create dedicated push spaces for specific bounties, making it easy to communicate and coordinate within the context of a particular task.

## License
The Gated Bounty Protocol is licensed under MIT. For more details, see `LICENSE.txt` in the project repository.

<!-- Made By -->
## Made By
This project is made as a part of <a href="https://ethglobal.com/events/ethonline2023">EthOnline 2023 Hackathon</a> by <a href="https://github.com/0xDaenerys">0xDaenerys</a> & <a href="https://github.com/gograce">Grace</a>
