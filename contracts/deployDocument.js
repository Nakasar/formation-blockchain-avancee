// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades, admin } = require("hardhat");

// load .env file
//const dotenv = require('dotenv');
// dotenv.config();

// const permissionOwner = process.env.PERMISSION_OWNER;

async function main() {
    // We get the contract to deploy
    const DocumentContract = await ethers.getContractFactory("contracts/v1/Document.sol:Document");
    const DocumentContractv2 = await ethers.getContractFactory("contracts/v2/Document.sol:Document");
    const Permission = await ethers.getContractFactory("contracts/v2/Permission.sol:Permission");
    
    
    /** Deploy v1 **/
    let document = await DocumentContract.deploy();
    
    /** Deploy v2 **/
    // let permission = await Permission.deploy();
    // let document = await upgrades.deployProxy(DocumentContractv2, [permissionContract.address]);
    // await document.deployed();
    
    /** add doc **/
    // await document.issueDocument("hash");
    
    // console.log("Permission Contract deployed to:", permission.address);
    console.log("Document Contract deployed to:", document.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});