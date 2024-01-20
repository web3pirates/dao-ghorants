import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { sepolia, useAccount } from 'wagmi'
import { waitForTransaction, writeContract } from 'wagmi/actions'

import { proposalManagerAbi } from '@/abi/ProposalManager'
import { Nav } from '@/components/Nav'
import {
  Button,
  CustomContainer,
  Description,
  Layout,
  Title,
} from '@/components/atoms'
import { useOpenAI } from '@/hooks/useOpenAI'
import { PROPOSAL_MANAGER_ADDRESS } from '@/utils/constants'
import { hackathons, submissions } from '@/utils/data'

const SubmissionView = () => {
  const [gptJudgement, setGptJudgement] = useState<string | null>(null)
  const [isTransacting, setIsTransacting] = useState(false)
  const router = useRouter()
  const { judgeRepo } = useOpenAI()
  const { address } = useAccount()
  const { id } = router.query

  const submission = submissions.find((s) => s.id === id)
  const proposal = hackathons.find((h) => h.id === submission?.proposalId)

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
          <Link href="/">
            <p>Back to competitions</p>
          </Link>

          <Title>{submission.title}</Title>
        </CustomContainer>
        <Button
          as="a"
          href={submission.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </Button>

        <Button onClick={analyzeRepo}>Analyze Repo</Button>
        <Description>{gptJudgement}</Description>

        <Button
          onClick={awardPrize}
          disabled={!isProposalAdmin || isTransacting}
        >
          Accept and Award Prize
        </Button>
      </Layout>
    </>
  )
}

export default SubmissionView
