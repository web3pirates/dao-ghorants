// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

struct Proposal {
    uint256 amount;
    address proposer;
    bool emitted;
}

IERC20 constant ghoToken = IERC20(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);

contract ProposalManager {
    mapping(uint256 => Proposal) public proposals;
    uint256 public lastId;

    event ProposalCreated(address proposer, uint256 id);
    event ProposalEmitted(address redeemer, uint256 id);

    function createProposal(uint256 amount) public {
        require(amount != 0, "Amount must be greater than zero");

        lastId++;

        ghoToken.transferFrom(msg.sender, address(this), amount);
        proposals[lastId] = Proposal(amount, msg.sender, false);

        emit ProposalCreated(msg.sender, lastId);
    }

    function acceptProposal(address redeemer, uint256 id) public {
        Proposal storage proposal = proposals[id];
        require(!proposal.emitted, "Proposal reward already redeemed.");
        require(
            proposal.proposer == msg.sender,
            "Only proposer can accept a proposal"
        );

        ghoToken.transferFrom(address(this), redeemer, proposal.amount);

        proposal.emitted = true;
        emit ProposalEmitted(redeemer, id);
    }
}
