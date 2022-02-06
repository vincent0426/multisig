//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract Multisig {
    address[] approvers;
    uint public quorum;
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    uint public nextId;
    mapping(address => bool) isApprovers;
    mapping(uint => Transfer) public transfers;
    mapping(address => mapping(uint => bool)) approvals;
    event CreateTransfer(uint id);
    event ApproveTransfer(uint id);
    
    constructor(address[] memory _approvers, uint _quorum) payable {
        for(uint i = 0; i < _approvers.length; i++) {
            isApprovers[_approvers[i]] = true;
        }
        approvers = _approvers;
        quorum = _quorum;
    }

    function createTransfer(uint amount, address payable to) external onlyApprover {
        transfers[nextId] = Transfer(nextId, amount, to, 0, false);
        
        emit CreateTransfer(nextId);
        nextId++;
    }

    function sendTransfer(uint id) external onlyApprover {
        require(!transfers[id].sent, "Transfer has been sent");
        require(!approvals[msg.sender][id], "Already approve");
        
        approvals[msg.sender][id] = true;
        transfers[id].approvals++;
        
        if(transfers[id].approvals >= quorum) {
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
        emit ApproveTransfer(id);
    }
    
    function balanceOf() view public returns(uint){
        return address(this).balance;
    }
    
    modifier onlyApprover() {
        require(isApprovers[msg.sender], "Only Approvers can action");
        _;
    }
} 