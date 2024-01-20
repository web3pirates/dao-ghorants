import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { SiOpenai } from 'react-icons/si'
import { useAsyncMemo } from 'use-async-memo'
import { sepolia, useAccount } from 'wagmi'
import { waitForTransaction, writeContract } from 'wagmi/actions'

import { proposalManagerAbi } from '@/abi/ProposalManager'
import { Nav } from '@/components/Nav'
import {
  Button,
  CustomContainer,
  Description,
  Layout,
  Row,
  Title,
} from '@/components/atoms'
import { useDB } from '@/hooks/useDB'
import { useOpenAI } from '@/hooks/useOpenAI'
import { PROPOSAL_MANAGER_ADDRESS } from '@/utils/constants'

const SubmissionView = () => {
  const [gptJudgement, setGptJudgement] = useState<string | null>(null)
  const [isTransacting, setIsTransacting] = useState(false)
  const router = useRouter()
  const { judgeRepo } = useOpenAI()
  const { address } = useAccount()
  const { fetchSubmission, fetchCompetition } = useDB()
  const { id } = router.query

  const submission = useAsyncMemo(async () => {
    if (!id) return
    return await fetchSubmission(id as string)
  }, [router.query])

  const proposal = useAsyncMemo(async () => {
    if (!submission) return
    return await fetchCompetition(submission.proposalId)
  }, [submission])

  const isProposalAdmin = useMemo(
    () => address === proposal?.admin,
    [address, proposal]
  )

  const awardPrize = useCallback(async () => {
    if (!submission || !proposal || !isProposalAdmin) return

    setIsTransacting(true)
    const { hash } = await writeContract({
      abi: proposalManagerAbi,
      address: PROPOSAL_MANAGER_ADDRESS,
      chainId: sepolia.id,
      functionName: 'acceptProposal',
      args: [submission.address, proposal.id],
    })

    // add loader for transaction

    const transaction = await waitForTransaction({
      chainId: sepolia.id,
      hash,
    })

    //add success message
    setIsTransacting(false)
  }, [isProposalAdmin, proposal, submission])

  const analyzeRepo = async () => {
    if (!submission || !proposal) return
    const judgement = await judgeRepo(
      proposal.description,
      submission.githubUrl
    )

    setGptJudgement(judgement)
  }

  if (!submission || !proposal)
    return (
      <>
        <Head>Page not found</Head>
        <Layout>404 - Page not found</Layout>
      </>
    )

  return (
    <>
      <Head>
        {submission.title}-{proposal.title}
      </Head>
      <Layout>
        <Nav />

        <CustomContainer as="main">
          <Title>{submission.title}</Title>
          <p>Submitted by: {submission.address}</p>
          <Row>
            <Button
              as="a"
              href={submission.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center', // Center the icon and text vertically
                width: '120px',
              }}
            >
              <FaGithub
                style={{ marginRight: '8px', height: '30px' }}
                size={20}
              />{' '}
              {/* GitHub icon */}
              GitHub
            </Button>
            <Button
              onClick={analyzeRepo}
              style={{
                display: 'flex',
                alignItems: 'center', // Center the icon and text vertically
                width: '160px',
                height: '50px',
              }}
            >
              <SiOpenai
                style={{ marginRight: '8px', height: '30px' }}
                size={20}
              />{' '}
              Analyze Repo
            </Button>
          </Row>
        </CustomContainer>

        {!!gptJudgement ? <Description>{gptJudgement}</Description> : null}

        {isProposalAdmin && (
          <Button onClick={awardPrize} disabled={isTransacting}>
            Accept and Award Prize
          </Button>
        )}
      </Layout>
    </>
  )
}

export default SubmissionView
