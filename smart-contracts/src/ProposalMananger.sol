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
    uint256 lastId;

    event ProposalCreated(address proposer, uint256 id);
    event ProposalRedeemed(address redeemer, uint256 id);

    function createProposal(uint256 amount) public {
        require(amount != 0, "Amount must be greater than zero");

        uint256 proposalId = lastId + 1;

        IERC20(ghoTokenAddress).transferFrom(msg.sender, address(this), amount);
        proposals[proposalId] = Proposal(amount, msg.sender, address(0), false);

        emit ProposalCreated(msg.sender, proposalId);
    }

    function acceptProposal(address reedeemer, uint256 id) public {
        Proposal storage proposal = proposals[id];

        require(
            proposal.proposer == msg.sender,
            "Only proposer can accept a proposal"
        );

        proposal.redeemer = reedeemer;
    }

    function reedeemProposal(uint256 id, address redeemer) public {
        Proposal storage proposal = proposals[id];
        require(!proposal.redeemed, "Proposal reward already redeemed.");
        require(
            proposal.redeemer == msg.sender,
            "You cannot redeem the reward of this proposal."
        );

        IERC20(ghoTokenAddress).transferFrom(
            address(this),
            redeemer,
            proposal.amount
        );

        proposal.redeemed = true;
        emit ProposalRedeemed(redeemer, id);
    }
}
