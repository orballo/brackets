require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-watcher");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.6",
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
};
