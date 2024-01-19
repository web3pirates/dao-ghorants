// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

struct Proposal {
    uint256 amount;
    address proposer;
    address redeemer;
    bool redeemed;
}

address constant ghoTokenAddress = 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60;

contract ProposalManager {
    mapping(uint256 => Proposal) proposals;

    event ProposalCreated(uint256 id);

    function createProposal(uint256 amount, uint256 id) public {
        require(amount != 0, "Amount must be greater than zero");
        require(
            proposals[id].proposer == address(0),
            "Proposal already created"
        );

        IERC20(ghoTokenAddress).transferFrom(msg.sender, address(this), amount);
        proposals[id] = Proposal(amount, msg.sender, address(0), false);
    }

    function acceptProposal(address reedeemer, uint256 id) public {
        Proposal storage proposal = proposals[id];

        require(
            proposal.proposer == msg.sender,
            "Only proposer can accept a proposal"
        );

        proposal.redeemer = reedeemer;
    }

    function reedeemProposal(uint256 id, address receiver) public {
        Proposal storage proposal = proposals[id];
        require(!proposal.redeemed, "Proposal reward already redeemed.");
        require(
            proposal.redeemer == msg.sender,
            "You cannot redeem the reward of this proposal."
        );

        IERC20(ghoTokenAddress).transferFrom(
            address(this),
            receiver,
            proposal.amount
        );

        proposal.redeemed = true;
    }
}
