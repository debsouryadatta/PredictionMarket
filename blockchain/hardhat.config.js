require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",

  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_URL,
      accounts: [PRIVATE_KEY] // it is required to sign transactions
    }
  },
};