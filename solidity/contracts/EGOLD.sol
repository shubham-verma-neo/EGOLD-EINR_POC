//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EINR.sol";

contract EGOLDContract is ERC20 {
    event Minted(address _to, uint256 _amount);
    event EINRAddressSet(address _setBy, address _EGOLDAdd);
    event EGOLDPriceSet(address _setBy, uint256 _EGOLDPrice);
    event EGOLDTransfer(address _from, address _to, uint256 _amount);

    EINRContract public _EINR;
    uint256 public EGoldPrice;
    uint256 public availableSupply;

    constructor() ERC20("EGOLD", "EGOLD") {
        uint256 _amount = 1000000 * 10**18;
        _mint(address(this), _amount);
        emit Minted(address(this), _amount);
        availableSupply = totalSupply();
    }

    function setEINR(address _Einr) public {
        _EINR = EINRContract(_Einr);
        emit EINRAddressSet(msg.sender, _Einr);
    }

    function setGoldPrice(uint256 _price) public {
        EGoldPrice = _price;
        emit EGOLDPriceSet(msg.sender, EGoldPrice);
    }

    function buyGold(uint256 _GoldAmount) public {
        require(EGoldPrice > 0, "EGOLD Price not set");
        uint256 totalEINR = EGoldPrice * (_GoldAmount / 10**18);
        require(
            _EINR.balanceOf(msg.sender) >= totalEINR,
            "Insuffcient Balance"
        );
        _EINR.transferBal(msg.sender, totalEINR);
        _transfer(address(this), msg.sender, _GoldAmount);
        availableSupply -= _GoldAmount;
        emit EGOLDTransfer(address(this), msg.sender, _GoldAmount);
    }

    function BalEINR() public view returns (uint256) {
        return (_EINR.balanceOf(address(this)));
    }
}
