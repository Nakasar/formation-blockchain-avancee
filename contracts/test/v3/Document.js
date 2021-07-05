const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");


describe("Documents v3", function() {

  let DocumentContract, PermissionContract, MultiSigWalletContract;
  let permission, document, multisig;
  let owner, issueKey, revokeKey, randomKey;
  const issueIdOperation = 1;
  const revokeIdOperation = 10;

  beforeEach(async function () {
    [owner, issueKey, revokeKey, randomKey] = await ethers.getSigners();
    DocumentContract = await ethers.getContractFactory("contracts/v2/Document.sol:Document");
    PermissionContract = await ethers.getContractFactory("contracts/v2/Permission.sol:Permission");
    MultiSigWalletContract = await ethers.getContractFactory("contracts/v3/MultiSig.sol:MultiSig");

    permission = await PermissionContract.deploy();
    multisig = await MultiSigWalletContract.deploy([owner.address, issueKey.address], 2);

    /** Deploy **/
    document = await upgrades.deployProxy(DocumentContract, [permission.address]);
    await document.deployed();

    await permission.allowAddress(multisig.address, issueIdOperation);
    await permission.allowAddress(multisig.address, revokeIdOperation);

  });

  describe("Multisig", function (){
    it("Should be deployed with 2 owners", async function () {
      console.log(await multisig.getOwners());
      expect(await multisig.getOwners()).to.have.same.members([owner.address, issueKey.address]);
    });
    it("Should allow a owner to submit a transaction", async function (){
      const data = DocumentContract.interface.encodeFunctionData("issueDocument", ["hash"]);
      await expect(multisig.connect(owner).submitTransaction(document.address, 0, data)).to.emit(multisig, "Submission")
    })
  })

  describe("Transactions", function (){
    it("Should allow an authorized multisig to issue a document", async function() {
      const data = DocumentContract.interface.encodeFunctionData("issueDocument", ["hash"]);
      await expect(multisig.connect(owner).submitTransaction(document.address, 0, data)).to.emit(multisig, "Submission")
      await expect(multisig.connect(issueKey).confirmTransaction(0)).to.emit(multisig, "Execution");
      expect(await document.getStatus("hash")).to.equal(1);

    });
    it("Should revert if an non-authorized account issue a document", async function() {
      await expect(document.connect(randomKey).revokeDocument("hash")).to.be.revertedWith("address is not allowed to perform this action");
    });
    it("Should allow an authorized account to revoke a document", async function() {
      const data = DocumentContract.interface.encodeFunctionData("issueDocument", ["hash"]);
      await expect(multisig.connect(owner).submitTransaction(document.address, 0, data)).to.emit(multisig, "Submission")
      await expect(multisig.connect(issueKey).confirmTransaction(0)).to.emit(multisig, "Execution");
      const dataRevoke = DocumentContract.interface.encodeFunctionData("revokeDocument", ["hash"]);
      await expect(multisig.connect(owner).submitTransaction(document.address, 0, dataRevoke)).to.emit(multisig, "Submission")
      await expect(multisig.connect(issueKey).confirmTransaction(1)).to.emit(multisig, "Execution")
      expect(await document.getStatus("hash")).to.equal(10);
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
