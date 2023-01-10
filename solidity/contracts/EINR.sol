//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EINRContract is ERC20{
    event Minted(address _to, uint256 _amount);
    event EGOLDAddressSet(address _setBy, address _EGOLDAdd);
    event TransferEINRtoEGOLD(address _from, address _to, uint256 _amount);

    address public EGOLD;


    constructor()ERC20("EINR", "EINR"){}

    modifier onlyEGOLD() {
        require(msg.sender == EGOLD, "only EGOLD contract");
        _;
    }

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
        emit Minted(msg.sender, _amount);
    }

    function setEGOLD(address _Egold) public {
        EGOLD = _Egold;
        emit EGOLDAddressSet(msg.sender, _Egold);
    }

    function transferBal(address _from, uint256 _amount) external onlyEGOLD {
        _transfer(_from, EGOLD, _amount);
        emit TransferEINRtoEGOLD(_from, EGOLD, _amount);
    }
}
