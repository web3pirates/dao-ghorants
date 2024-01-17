// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

struct Proposal {
    address token;
    uint256 amount;
    bool fulfilled;
}

contract ProposalManager {
    mapping(uint256 => Proposal) proposals;

    event ProposalCreated(uint256 id);

    function createProposal(address token, uint256 amount, uint256 id) public {
        require(token != address(0) && amount != 0, "Invalid input parameters");
        require(
            proposals[id].token == address(0) && proposals[id].amount == 0,
            "Proposal already created"
        );

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        proposals[id] = Proposal(token, amount, false);
    }

    function fulfillProposal(
        uint256 id,
        address receiver,
        uint256 secret
    ) public {
        Proposal memory proposal = proposals[id];
        require(
            proposal.token != address(0) && proposal.amount != 0,
            "Proposal not found"
        );
        require(_verifySecret(secret), "Not authorized");

        IERC20(proposal.token).transferFrom(
            address(this),
            receiver,
            proposal.amount
        );
    }

    function _verifySecret(uint256 secret) internal view returns (bool) {
        return true;
    }
}
