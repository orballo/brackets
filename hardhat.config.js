require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("hardhat-watcher");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  watcher: {
    test: {
      tasks: ["test"],
    },
  },
  gasReporter: {
    coinmarketcap: "6c2bae67-59dd-4972-9e6a-9faeca942d72",
  },
};
