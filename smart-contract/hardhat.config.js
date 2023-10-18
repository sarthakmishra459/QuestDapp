require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_API_KEY = "YcJPL3c3_TjE8ygTI774RGla_J-EUILC";
const SEPOLIA_PRIVATE_KEY = "ed8b083859c6494b4066d4259c47892bc1482fe7f90e0a8a668fa3ca4807190c";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
  solidity: "0.8.19",
};
