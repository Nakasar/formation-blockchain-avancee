const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");


describe("StudentLoan v2", function() {
  
  let DocumentContract, PermissionContract;
  let permission, document;
  let owner, issueKey, revokeKey, randomKey;
  const issueIdOperation = 1;
  const revokeIdOperation = 10;
  
  beforeEach(async function () {
    [owner, issueKey, revokeKey, randomKey] = await ethers.getSigners();
    DocumentContract = await ethers.getContractFactory("contracts/v2/Document.sol:Document");
    PermissionContract = await ethers.getContractFactory("contracts/v2/Permission.sol:Permission");
  
    permission = await PermissionContract.deploy();
  
    /** Deploy **/
    document = await upgrades.deployProxy(DocumentContract, [permission.address]);
    await document.deployed();
  
    await permission.allowAddress(issueKey.address, issueIdOperation);
    await permission.allowAddress(revokeKey.address, revokeIdOperation);
  
  });
  
  describe("Transactions", function (){
    it("Should allow an authorized account to issue a document", async function() {
      await document.connect(issueKey).issueDocument("hash");
      expect(await document.getStatus("hash")).to.equal(1);
    });
    it("Should revert if a someone tries to revert a document that does not exist", async function() {
      await expect(document.connect(revokeKey).revokeDocument("hash")).to.be.revertedWith("document is not in the issued state");
    });
    it("Should revert if an non-authorized account issue a document", async function() {
      await expect(document.connect(randomKey).issueDocument("hash")).to.be.revertedWith("address is not allowed to perform this action");
    });
    it("Should allow an authorized account to revoke a document", async function() {
      await document.connect(issueKey).issueDocument("hash");
      await document.connect(revokeKey).revokeDocument("hash");
      expect(await document.getStatus("hash")).to.equal(10);
    });
    it("Should revert if an non-authorized account try to revoke a document", async function() {
      await expect(document.connect(randomKey).revokeDocument("hash")).to.be.revertedWith("address is not allowed to perform this action");
    });
  })
  
  // describe("Upgrade", function () {
  //   beforeEach(async function(){
  //     await studentLoan.connect(issueKey).issueLoan("hash", 10001);
  //     studentLoan = await upgrades.upgradeProxy(studentLoan.address, StudentLoanContractV2);
  //   });
  //
  //   it("Should uses the same address and conserve data", async function() {
  //     expect(await studentLoan.getStatus("hash")).to.equal(1);
  //   });
  //   it("Should not allow an non signed loan to be redeemed", async function() {
  //     await expect(studentLoan.connect(redeemKey).redeemLoan("hash")).to.be.revertedWith("hash is not in the signed state");
  //   });
  // });
});