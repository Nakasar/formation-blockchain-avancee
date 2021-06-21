pragma solidity >=0.7.4;

import "./Permission.sol";
import "@openzeppelin/contracts/proxy/Initializable.sol";


contract Document is Initializable {

    uint256 constant issueIdOperation = 1;
    uint256 constant revokeIdOperation = 10;

    mapping(string => uint256) hashToTimestamp;
    mapping(string => uint256) hashToStatus;

    Permission permissionContract;

    uint256 constant ISSUED = 1;
    uint256 constant REVOKED = 10;
    /*
     * State are the following for hashToStatus
     * 1  -> isssued
     * 10 -> revoked
     * 2  -> redeemed
     */

    function initialize(address permissionContractAddress) public initializer {
        permissionContract = Permission(permissionContractAddress);
    }


    event issuanceMade (
        string hash,
        address indexed sender
    );

    event issuanceRevoked (
        string hash,
        address indexed sender
    );

    modifier isAllowedToIssue() {
        require(permissionContract.isAllowed(msg.sender, issueIdOperation), "address is not allowed to perform this action");
        _;
    }

    modifier isAllowedToRevoke() {
        require(permissionContract.isAllowed(msg.sender, revokeIdOperation), "address is not allowed to perform this action");
        _;
    }

    function issueDocument(string memory hash) public isAllowedToIssue {
        require(hashToStatus[hash] == 0, "document is already deposited");
        hashToStatus[hash] = ISSUED;
        emit issuanceMade(hash, msg.sender);
    }

    function revokeDocument(string memory hash) public isAllowedToRevoke {
        require(hashToStatus[hash] == ISSUED, "document is not in the issued state");
        hashToStatus[hash] = REVOKED;
        emit issuanceRevoked(hash, msg.sender);
    }

    function getStatus(string memory hash) public view returns(uint256) {
        return hashToStatus[hash];
    }

    // throw if no method called
    fallback() external payable { revert('revert'); }
}

