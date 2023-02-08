//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./EGOLD.sol";

contract Inventory {
    event EGOLDAddressSet(address _EGOLDAddress);
    event eGOLDRatio(uint256 _eGOLDTokens);
    event InventoryAdded(address _addBy, uint256 _amount);
    event InventoryRemoved(address _removeBy, uint256 _amount);

    address public admin;
    EGOLDContract public EGOLDAdd;
    uint256 public inventory;
    uint256 public eGOLDratio;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin access.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setEGOLDAddress(address _EGOLDAddress) public onlyAdmin {
        EGOLDAdd = EGOLDContract(_EGOLDAddress);
        emit EGOLDAddressSet(_EGOLDAddress);
    }

    function setRatio(uint256 _eGOLD)public onlyAdmin{
        eGOLDratio = _eGOLD;
        emit eGOLDRatio(_eGOLD);
    }

    function addInventory(uint256 _amount) public onlyAdmin {
        require(eGOLDratio > 0, "eGOLDRatio should not be zero.");
        inventory += _amount;
        EGOLDAdd.mint(_amount * eGOLDratio);
        emit InventoryAdded(msg.sender, _amount);
    }

    function removeInventory(uint256 _amount) public onlyAdmin {
        require(eGOLDratio > 0, "eGOLDRatio should not be zero.");
        require(inventory >= _amount, "Insufficient inventory.");
        inventory -= _amount;
        EGOLDAdd.burn(_amount * eGOLDratio);
        emit InventoryRemoved(msg.sender, _amount);
    }

}
