require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");


module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
        },
        ganache: {
            url: "HTTP://127.0.0.1:8555",
            accounts: ["42702de4e5404ffce926dce06131011e812dd8e79b0ee00fd6d5e36afb07f73a"]
        },
        staging: {
            url: "HTTP://127.0.0.1:8545",
            accounts: ["18c48ac85884985b703b7e455f94956e0ca73c22eb5e0f276c6af14b12d1d584"],
            gasPrice: 0
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    solidity: {
        compilers: [
            {
                version: "0.4.11"
            },
            {
                version: "0.5.17"
            },
            {
                version: "0.7.4",
                settings: { }
            }
        ]
    }
}