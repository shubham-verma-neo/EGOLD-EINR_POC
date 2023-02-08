//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EINR.sol";

contract EGOLDContract is ERC20 {
    event Minted(address indexed _to, uint256 _amount);
    event Burned(address indexed _to, uint256 _amount);
    event InventoryAddressSet(address indexed _setBy, address indexed _InventoryAdd);
    event EINRAddressSet(address indexed _setBy, address indexed _EGOLDAdd);
    event EGOLD_EINR_PriceSet(address indexed _setBy, uint256 _EGOLDPriceEINR);
    event EGOLD_INR_PriceSet(address indexed _setBy, uint256 _EGOLDPriceINR);
    event EGOLD_EINR_Transfer(
        address _from,
        address indexed _to,
        uint256 _EGoldAmount,
        uint256 _EINRAmount
    );
    event EGOLD_INR_Transfer(
        address _from,
        address indexed _to,
        string indexed _receipt,
        uint256 _EGoldmount,
        uint256 _INRAmount
    );

    EINRContract public _EINR;
    uint256 public EGoldPriceEINR;
    uint256 public EGoldPriceINR;
    uint256 public availableSupply;
    address public inventoryHandler;

    modifier onlyInventoryHandler(){
        require(msg.sender == inventoryHandler, "Only Inventory Handler Contract allowed.");
        _;
    }
    constructor() ERC20("EGOLD", "EGOLD") {}

    function setInventoryHandler(address _address)public {
        require(inventoryHandler == address(0), "inventory Handler already set.");
        inventoryHandler = _address;
        emit InventoryAddressSet(msg.sender, inventoryHandler);
    }

    function mint(uint256 _amount) public onlyInventoryHandler{
        _mint(address(this), _amount);
        availableSupply = totalSupply();
        emit Minted(address(this), _amount);
    }

    function burn(uint256 _amount) public onlyInventoryHandler{
        require(balanceOf(address(this)) >= _amount, "Insufficient EGOLD in Contract.");
        _burn(address(this), _amount);
        availableSupply = totalSupply();
        emit Burned(address(this), _amount);
    }

    function setEINR(address _Einr) public {
        _EINR = EINRContract(_Einr);
        emit EINRAddressSet(msg.sender, _Einr);
    }

    function setGoldPriceEINR(uint256 _price) public {
        EGoldPriceEINR = _price;
        emit EGOLD_EINR_PriceSet(msg.sender, EGoldPriceEINR);
    }

    function setGoldPriceINR(uint256 _price) public {
        EGoldPriceINR = _price;
        emit EGOLD_INR_PriceSet(msg.sender, EGoldPriceINR);
    }

    function buyEGoldEINR(uint256 _EGoldAmount) public {
        require(balanceOf(address(this)) >= _EGoldAmount, "Insufficient EGOLD in Contract.");
        require(EGoldPriceEINR > 0, "EGOLD Price not set");
        uint256 totalEINR = EGoldPriceEINR * (_EGoldAmount / 10**18);
        require(
            _EINR.balanceOf(msg.sender) >= totalEINR,
            "Insuffcient Balance"
        );
        _EINR.transferBal(msg.sender, totalEINR);
        _transfer(address(this), msg.sender, _EGoldAmount);
        availableSupply -= _EGoldAmount;
        emit EGOLD_EINR_Transfer(
            address(this),
            msg.sender,
            _EGoldAmount,
            totalEINR
        );
    }

    function buyEGoldINR(uint256 _EGoldAmount, string memory _receipt) public {
        require(balanceOf(address(this)) >= _EGoldAmount, "Insufficient EGOLD in Contract.");
        uint256 totalINR = (EGoldPriceINR / 10**18) * (_EGoldAmount / 10**18);
        _transfer(address(this), msg.sender, _EGoldAmount);
        availableSupply -= _EGoldAmount;
        emit EGOLD_INR_Transfer(
            address(this),
            msg.sender,
            _receipt,
            _EGoldAmount,
            totalINR
        );
    }

    function BalEINR() public view returns (uint256) {
        return (_EINR.balanceOf(address(this)));
    }
}
