require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat:{
      live: false,
      saveDeployments: true,
      tags:["local"],
      // Uncomment these lines to use mainnet fork
      forking: {
        url: process.env.MUMBAI_NODE,
        blockNumber: 18346862,
      },
    },
    mumbai: {
      live: true,
      saveDeployments: true,
      tags:["mumbai"],
      url: process.env.MUMBAI_NODE,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    ropsten: {
      live: true,
      saveDeployments: true,
      tags:["ropsten"],
      url: process.env.MUMBAI_NODE,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    goerli: {
      live: true,
      saveDeployments: true,
      tags:["goerli"],
      url: process.env.GOERLI_NODE,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    rinkeby: {
      live: true,
      saveDeployments: true,
      tags:["rinkeby"],
      url: process.env.RINKEBY_NODE,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    kovan: {
      live: true,
      saveDeployments: true,
      tags:["kovan"],
      url: process.env.KOVAN_NODE,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    binance: {
      live: true,
      saveDeployments: true,
      tags:["binance"],
      url: process.env.BSCTEST_NODE,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
  },
  solidity: {
    compilers: [
      // {
      //   version: "0.6.7",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200
      //     }
      //   } 
      // },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        } 
      }
    ],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
  namedAccounts: {
    deployer: {
      default: 0, // default network
      "mumbai": "0x5e4634Ad0897Ec4895A9b10748a11CB6f02007ba", // mumbai network, from env.MAINNET_PRIV
      "ropsten":"0x5e4634Ad0897Ec4895A9b10748a11CB6f02007ba",
      "rinkeby":"0x5e4634Ad0897Ec4895A9b10748a11CB6f02007ba",
      "goerli":"0x5e4634Ad0897Ec4895A9b10748a11CB6f02007ba",
      "kovan":"0x5e4634Ad0897Ec4895A9b10748a11CB6f02007ba",
      "binance":"0x5e4634Ad0897Ec4895A9b10748a11CB6f02007ba"
    },
    admin: {
      default: 1,
    },
    feeCollector: {
      default: 2, // default network
      "mumbai": "", // mumbai network, from env.MAINNET_PRIV
      "ropsten":"",
      "rinkeby":"",
      "goerli":"",
      "kovan":"",
      "binance":""
    },
    alice: {
      default: 19, // default network
      "mumbai": "", // mumbai network, from env.MAINNET_PRIV
      "ropsten":"",
      "rinkeby":"",
      "goerli":"",
      "kovan":"",
      "binance":""
    }
  },
  paths:{
    scripts:"scripts",
    sources:"./contracts",
    tests:"./test",
    cache:"./cache",
    artifacts:"./artifacts",
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports'
  },
  mocha: {
    timeout: 240000,
  },
  gasReporter: {
    currency: 'MATIC',
    gasPrice:5
  },
};
