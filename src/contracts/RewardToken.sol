// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RewardToken {
    address public owner;
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed transferFrom, address indexed transferTo, uint256 transferAmount);
    event Approval(address indexed owner, address indexed approvalTo, uint256 approvalAmount);

    constructor() {
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
    }

    function approval(address _approvalTo, uint256 _approvalAmount) public returns (bool success) {
        require(_approvalAmount <= balanceOf[msg.sender], 'The amount entered is invalid');
        allowance[msg.sender][_approvalTo] = _approvalAmount;
        emit Approval(msg.sender, _approvalTo, _approvalAmount);
        return true;
    }

    function transfer(address _transferTo, uint256 _transferAmount ) public returns (bool success) {
        require(_transferAmount <= balanceOf[msg.sender], 'The amount entered is invalid');
        balanceOf[_transferTo] += _transferAmount;
        balanceOf[msg.sender] -= _transferAmount;
        emit Transfer(msg.sender, _transferTo, _transferAmount);
        return true;
    }

    function thirdPartyTransfer(address _transferFrom, address _transferTo, uint256 _transferAmount) public returns (bool success) {
        require(_transferAmount <= balanceOf[_transferFrom], 'The amount entered is invalid');
        require(_transferAmount <= allowance[_transferFrom][msg.sender], 'The amount entered does not matches with the allowance amount');
        balanceOf[_transferTo] += _transferAmount;
        balanceOf[_transferFrom] -= _transferAmount;
        allowance[_transferFrom][msg.sender] -= _transferAmount;
        emit Transfer(_transferFrom, _transferTo, _transferAmount);
        return true;

    }
}