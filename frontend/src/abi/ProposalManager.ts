export const proposalManagerAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'proposer',
        type: 'address',
      },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'ProposalCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'redeemer',
        type: 'address',
      },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'ProposalRedeemed',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'reedeemer', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'acceptProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'createProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'address', name: 'redeemer', type: 'address' },
    ],
    name: 'reedeemProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
