import { useCallback, useMemo, useState } from 'react'
import { useAsyncMemo } from 'use-async-memo'
import { erc20ABI, sepolia, useAccount } from 'wagmi'
import { readContract, waitForTransaction, writeContract } from 'wagmi/actions'

import { proposalManagerAbi } from '@/abi/ProposalManager'
import { Nav } from '@/components/Nav'
import {
  Button,
  Container,
  Description,
  Form,
  FormGroup,
  Input,
  Label,
  Layout,
  Title,
} from '@/components/atoms'
import {
  GHO_CONTRACT_ADDRESS,
  GHO_DECIMALS,
  PROPOSAL_CREATED_TOPIC_0,
  PROPOSAL_MANAGER_ADDRESS,
} from '@/utils/constants'

// Page component
const CreateCompetitionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reward: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const { address } = useAccount()

  const allowance = useAsyncMemo(async () => {
    if (!address) return
    const allowance = await readContract({
      address: GHO_CONTRACT_ADDRESS,
      chainId: sepolia.id,
      abi: erc20ABI,
      args: [address, PROPOSAL_MANAGER_ADDRESS],
      functionName: 'allowance',
    })

    return allowance
  }, [address, isLoading])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const amount = useMemo(
    () => BigInt(formData.reward) * BigInt(10 ** GHO_DECIMALS),
    [formData.reward]
  )

  const shouldApprove = useMemo(
    () => (allowance || 0) < amount,
    [allowance, amount]
  )

  const handleApprove = useCallback(async () => {
    setIsLoading(true)
    const { hash } = await writeContract({
      abi: erc20ABI,
      address: GHO_CONTRACT_ADDRESS,
      chainId: sepolia.id,
      functionName: 'approve',
      args: [PROPOSAL_MANAGER_ADDRESS, amount],
    })

    // add loader for transaction

    const transaction = await waitForTransaction({
      chainId: sepolia.id,
      hash,
    })

    //add success message
    setIsLoading(false)
  }, [amount])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Handle form submission logic here

    setIsLoading(true)
    const { hash } = await writeContract({
      abi: proposalManagerAbi,
      address: PROPOSAL_MANAGER_ADDRESS,
      chainId: sepolia.id,
      functionName: 'createProposal',
      args: [parseInt(formData.reward) * GHO_DECIMALS],
    })

    // add loader for transaction

    const transaction = await waitForTransaction({
      chainId: sepolia.id,
      hash,
    })

    const proposalId = parseInt(
      transaction.logs.find((l) => l.topics[0] === PROPOSAL_CREATED_TOPIC_0)
        ?.topics[2] || '0x0',
      16
    )

    //add success message

    //save proposal to DB
    setIsLoading(false)
  }

  return (
    <Layout>
      <Nav />

      <Container
        as="main"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Title>Create Your Own Competition</Title>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Competition Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter competition name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="startDate">Start Date:</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="endDate">End Date:</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="reward">Reward for winners (GHO):</Label>
            <Input
              type="number"
              id="reward"
              name="reward"
              placeholder="Enter reward in GHO"
              value={formData.reward}
              onChange={handleChange}
            />
          </FormGroup>

          {shouldApprove && (
            <Button onClick={handleApprove} disabled={isLoading}>
              Approve GHO
            </Button>
          )}
          <Button type="submit" disabled={shouldApprove || isLoading}>
            Submit
          </Button>
        </Form>
      </Container>
    </Layout>
  )
}

export default CreateCompetitionPage