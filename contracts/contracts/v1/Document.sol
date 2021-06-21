pragma solidity >=0.7.4;


contract Document {

    uint256 constant issueIdOperation = 1;

    mapping(string => uint256) hashToStatus;
    address owner;
    uint256 constant ISSUED = 1;
    uint256 constant REVOKED = 10;
    /*
     * State are the following for hashToStatus
     * 1  -> issued
     * 10 -> revoked
     */

    constructor() {
        owner = msg.sender;
    }

    event issuanceMade (
        string hash,
        address indexed sender
    );

    event issuanceRevoked (
        string hash,
        address indexed sender
    );

    modifier isAllowed() {
        require(msg.sender == owner, "address is not allowed to perform this action");
        _;
    }

    function issueDocument(string memory hash) public isAllowed {
        require(hashToStatus[hash] == 0, "document is already deposited");
        hashToStatus[hash] = ISSUED;
        emit issuanceMade(hash, msg.sender);
    }

    function revokeDocument(string memory hash) public isAllowed {
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

