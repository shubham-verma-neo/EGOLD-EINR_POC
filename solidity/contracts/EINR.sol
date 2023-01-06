//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract EINR is ERC20("EINR", "EINR"){
    address public EGOLD;

    modifier onlyEGOLD(){
        require(msg.sender == EGOLD, "only EGOLD contract");
        _;
    }

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

    function setEGOLD(address _Egold)public {
        EGOLD = _Egold;
    }

    function transferBal(address _from, uint256 _amount)external onlyEGOLD{
        _transfer(_from, EGOLD, _amount);
    }
}
