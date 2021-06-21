pragma solidity >=0.6.0;


abstract contract PermissionInterface {

    // check if an address is the owner
    function isOwner(address sender) public virtual view returns(bool);

    // check if an address is Allowed to perform an action
    function isAllowed(address sender, uint256 operationId) public virtual view returns(bool);

}

contract Permission is PermissionInterface {
    // contract's owner
    address public owner;

    // allowed permission
    mapping(bytes32 => bool) public allowedPermissions;

    // modifier to check if the message sender is the owner
    modifier onlyOwner {
        require(msg.sender == owner, "only owner is allowed to perform action");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    event AddressAllowed (
        address newAddress,
        uint256 operationId
    );

    event AddressRevoked (
        address addressRevoked,
        uint256 operationId
    );

    event OwnerChanged (
        address newOwner
    );

    // check if an address is the owner
    function isOwner(address sender) public override view returns(bool) {
        return (sender == owner);
    }

    // changes contract's owner
    function changeOwner(address _owner) public onlyOwner {
        owner = _owner;
        emit OwnerChanged(_owner);
    }

    // check if an adress is Allowed to perform an action
    function isAllowed(address sender, uint256 operationId) public override view returns(bool) {
        return allowedPermissions[keccak256(abi.encodePacked(sender, operationId))];
    }

    // allow an address to perform an operation
    function allowAddress(address newAddress, uint256 operationId) public onlyOwner {
        allowedPermissions[keccak256(abi.encodePacked(newAddress, operationId))] = true;
        emit AddressAllowed(newAddress, operationId);
    }

    function revokeAddress(address addressToRevoke, uint256 operationId) public onlyOwner {
        allowedPermissions[keccak256(abi.encodePacked(addressToRevoke, operationId))] = false;
        emit AddressRevoked(addressToRevoke, operationId);
    }
}
