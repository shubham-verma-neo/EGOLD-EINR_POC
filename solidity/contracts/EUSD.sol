//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EUSDContract is Ownable, ERC20 {
    event Minted(address indexed _owner, address indexed _to, uint256 indexed _amount);
    event EGOLDAddressSet(address indexed _setBy, address indexed _EGOLDAdd);
    event TransferEUSDtoEGOLD(
        address indexed _from,
        address _to,
        uint256 _amount
    );

    address public EGOLD;

    constructor() ERC20("EUSD", "EUSD") {}

    modifier onlyEGOLD() {
        require(msg.sender == EGOLD, "only EGOLD contract");
        _;
    }

    function mint(address _account, uint256 _amount) public onlyOwner {
        _mint(_account, _amount);
        emit Minted(msg.sender, _account, _amount);
    }

    function setEGOLD(address _Egold) public onlyOwner {
        EGOLD = _Egold;
        emit EGOLDAddressSet(msg.sender, _Egold);
    }

    function transferBal(address _from, uint256 _amount) external onlyEGOLD {
        _transfer(_from, EGOLD, _amount);
        emit TransferEUSDtoEGOLD(_from, EGOLD, _amount);
    }
}
