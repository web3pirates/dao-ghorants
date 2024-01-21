import { useCallback, useEffect, useMemo, useState } from 'react'
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
  Select,
  TextArea,
  Title,
} from '@/components/atoms'
import {
  GHO_CONTRACT_ADDRESS,
  GHO_DECIMALS,
  PROPOSAL_CREATED_TOPIC_0,
  PROPOSAL_MANAGER_ADDRESS,
} from '@/utils/constants'
import { http } from '@/utils/fetch'

// Page component
const CreateCompetitionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    typeOfGrant: '',
    prize: '',
    admin: '',
    imageUrl: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const { address } = useAccount()

  useEffect(
    () => setFormData((data) => ({ ...data, admin: address || '' })),
    [address]
  )

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
    () => BigInt(formData.prize) * BigInt(10 ** GHO_DECIMALS),
    [formData.prize]
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

    setIsLoading(true)
    const { hash } = await writeContract({
      abi: proposalManagerAbi,
      address: PROPOSAL_MANAGER_ADDRESS,
      chainId: sepolia.id,
      functionName: 'createProposal',
      args: [BigInt(formData.prize) * BigInt(10 ** GHO_DECIMALS)],
    })

    // add loader for transaction

    const transaction = await waitForTransaction({
      chainId: sepolia.id,
      hash,
    })

    const proposalId = parseInt(
      transaction.logs
        .find((l) => l.topics[0] === PROPOSAL_CREATED_TOPIC_0)
        ?.data.split(PROPOSAL_CREATED_TOPIC_0)[1] || '0x0',
      16
    )

    const data = {
      ...formData,
      id: proposalId,
      prize: parseFloat(formData.prize),
    }

    try {
      await http({
        method: 'POST',
        form: data,
        json: true,
        url: '/competitions',
      })
    } catch (e) {
      console.error(e)
    }

    //add success message
    setIsLoading(false)
  }

  return (
    <Layout>
      <Nav />

      <Container
        as="main"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Title>Create a new Grant</Title>
        <Description>
          By creating a new grant, you will be able to distribute GHO to winners
          of your grant. You will be able to set the amount of participants, the
          start and end date of the grant, the prize for winners and the
          description of the grant.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Grant Title:</Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Enter grant title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Grant Type:</Label>
            <Select
              id="type"
              name="type"
              value={formData.typeOfGrant}
              onChange={handleChange}
            >
              <option value="project">Project</option>
              <option value="bounty">Bounty</option>
              <option value="social">Hackathon</option>
              <option value="translation">Translation</option>
              <option value="documentation">Documentation</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description:</Label>
            <TextArea
              id="description"
              name="description"
              placeholder="Enter grant description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="image">Image URL:</Label>
            <Input
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="Enter image URL"
              value={formData.imageUrl}
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
            <Label htmlFor="prize">Prize for winners (GHO):</Label>
            <Input
              type="number"
              id="prize"
              name="prize"
              placeholder="Enter reward in GHO"
              value={formData.prize}
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
