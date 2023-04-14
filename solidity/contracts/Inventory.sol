//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EGOLD.sol";

contract Inventory is Ownable{
    event EGOLDAddressSet(address indexed _EGOLDAddress);
    event eGOLDRatio(uint256 _eGOLDTokens);
    event InventoryAdded(address indexed _addBy, uint256 indexed _amount);
    event InventoryRemoved(address indexed _removeBy, uint256 indexed _amount);

    address public admin;
    EGOLDContract public EGOLDAdd;
    uint256 public inventory;
    uint256 public eGOLDratio;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin access.");
        _;
    }

    constructor(uint256 _eGOLDRatio) {
        admin = msg.sender;
        eGOLDratio = _eGOLDRatio * 10**18;
    }

    function setEGOLDAddress(address _EGOLDAddress) public onlyAdmin {
        EGOLDAdd = EGOLDContract(_EGOLDAddress);
        emit EGOLDAddressSet(_EGOLDAddress);
    }

    function addInventory(uint256 _amount) public onlyAdmin {
        require(address(EGOLDAdd) != address(0), "EGOLD address not set.");
        require(eGOLDratio > 0, "eGOLDRatio should not be zero.");
        inventory += _amount;
        EGOLDAdd.mint(_amount * eGOLDratio);
        emit InventoryAdded(msg.sender, _amount);
    }

    function removeInventory(uint256 _amount) public onlyAdmin {
        require(address(EGOLDAdd) != address(0), "EGOLD address not set.");
        require(eGOLDratio > 0, "eGOLDRatio should not be zero.");
        require(inventory >= _amount, "Insufficient inventory.");
        inventory -= _amount;
        EGOLDAdd.burn(_amount * eGOLDratio);
        emit InventoryRemoved(msg.sender, _amount);
    }

}
