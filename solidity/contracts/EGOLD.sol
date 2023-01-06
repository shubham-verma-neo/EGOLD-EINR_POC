//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EINR.sol";

contract EGOLD is ERC20 {
    EINR public _EINR;
    uint256 public EGoldPrice;
    uint256 public availableSupply;

    constructor() ERC20("EGOLD", "EGOLD") {
        _mint(address(this), 1000000);
        availableSupply = totalSupply();
    }

    function setEINR(address _Einr) public {
        _EINR = EINR(_Einr);
    }

    function setGoldPrice(uint256 _price) public {
        EGoldPrice = _price;
    }

    function buyGold(uint256 _GoldAmount) public {
        uint256 totalEINR = EGoldPrice * _GoldAmount;
        require(
            _EINR.balanceOf(msg.sender) >= totalEINR,
            "Insuffcient Balance"
        );
        _EINR.transferBal(msg.sender, totalEINR);
        _transfer(address(this), msg.sender, _GoldAmount);
        availableSupply -= _GoldAmount;
    }

    function BalEINR() public view returns (uint256) {
        return (_EINR.balanceOf(address(this)));
    }
}
