import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { use, useCallback, useMemo, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { SiOpenai } from 'react-icons/si'
import { useAsyncMemo } from 'use-async-memo'
import { v4 as uuidv4 } from 'uuid'
import { sepolia, useAccount } from 'wagmi'
import { waitForTransaction, writeContract } from 'wagmi/actions'

import { proposalManagerAbi } from '@/abi/ProposalManager'
import { Nav } from '@/components/Nav'
import {
  Button,
  CustomContainer,
  Description,
  GPTDescription,
  Layout,
  Loader,
  Row,
  Title,
} from '@/components/atoms'
import { useDB } from '@/hooks/useDB'
import { useGithub } from '@/hooks/useGithub'
import { useOpenAI } from '@/hooks/useOpenAI'
import { PROPOSAL_MANAGER_ADDRESS } from '@/utils/constants'
import { http } from '@/utils/fetch'

const SubmissionView = () => {
  const [gptJudgement, setGptJudgement] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [isTransacting, setIsTransacting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { giveScoreForRepo, judgeRepo } = useOpenAI()
  const { address } = useAccount()
  const { fetchSubmission, fetchCompetition, fetchJudgement } = useDB()
  const { fetchRepoInfo } = useGithub()
  const { id } = router.query

  const submission = useAsyncMemo(async () => {
    if (!id) return
    return await fetchSubmission(id as string)
  }, [router.query])

  console.log('submission', submission)

  const judgement = useAsyncMemo(async () => {
    if (!id) return
    return await fetchJudgement(id as string)
  }, [router.query])

  console.log('judgement', judgement)

  const repoInfo = useAsyncMemo(async () => {
    if (!submission) return

    console.log('submission', submission)

    // const owner = submission.githubUrl.split('/')[3]
    const owner = 'wagmi'
    return await fetchRepoInfo(owner, submission.githubUrl)
  }, [submission])

  console.log(repoInfo)

  const proposal = useAsyncMemo(async () => {
    try {
      console.log('submission for PROPOSAL', submission)
      if (!submission) return
      return await fetchCompetition(submission.proposalId)
    } catch (e) {
      console.error(e)
    }
  }, [submission])

  console.log('proposal', proposal)

  const isProposalAdmin = useMemo(
    () => address === proposal?.admin,
    [address, proposal]
  )

  const scoreIsGood = useMemo(() => score && score > 80, [score])

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
    if (address === null) {
      alert('Please connect your wallet first!')
      return
    }
    setIsLoading(true)
    const judgement = await judgeRepo(
      proposal.description,
      submission.githubUrl
    )

    const score = await giveScoreForRepo(
      proposal.description,
      submission.githubUrl
    )

    //   title: { type: String },
    //   creativity: { type: Number },
    //   useOfBlockchain: { type: Number },
    //   impact: { type: Number },
    //   collaboration: { type: Number },
    //   reliability: { type: Number },
    //   textJudgement: { type: String },
    //   overallScore: { type: Number },
    // });

    const formData = {
      proposalId: uuidv4(),
      score,
      judgement,
      submissionId: submission.id,
      judgeAddress: address,
      chatGptJudgement: judgement,
      chatGptScore: score,
    }

    try {
      await http({
        method: 'POST',
        form: formData,
        json: true,
        url: '/judgements',
      })
    } catch (e) {
      console.error(e)
    }

    setIsLoading(false)
    setGptJudgement(judgement)
    setScore(score)
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
          <p
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Submitted by: {submission.address}
          </p>
          <Description>{submission.description}</Description>
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
          <div>
            {isLoading ? (
              <div>
                <Description>Analyzing repository...</Description>
                <Loader />
              </div>
            ) : !!gptJudgement ? (
              <div>
                <Description>Repository has been analyzed! </Description>
                <GPTDescription>{gptJudgement}</GPTDescription>
                <GPTDescription>
                  {' '}
                  The repository has a score of {score} out of 100.
                </GPTDescription>
                {scoreIsGood ? (
                  <GPTDescription> This is a good score! 🚀🚀 </GPTDescription>
                ) : (
                  <GPTDescription> This is a bad score! 😭</GPTDescription>
                )}
              </div>
            ) : !!judgement ? (
              <div>
                <Description>
                  Repository has been analyzed on the {judgement.createdAt}{' '}
                </Description>
                <GPTDescription>{judgement.textJudgement}</GPTDescription>
                <GPTDescription>
                  {' '}
                  The repository has a score of {judgement.overallScore} out of
                  100.
                </GPTDescription>
                {judgement.overallScore > 80 ? (
                  <GPTDescription> This is a good score! 🚀🚀 </GPTDescription>
                ) : (
                  <GPTDescription> This is a bad score! 😭</GPTDescription>
                )}
              </div>
            ) : (
              <div>
                <Description>
                  This repository has not been analyzed yet.
                </Description>
              </div>
            )}
          </div>
        </CustomContainer>

        {isProposalAdmin && score && scoreIsGood && (
          <Button onClick={awardPrize} disabled={isTransacting}>
            Accept and Award Prize
          </Button>
        )}
      </Layout>
    </>
  )
}

export default SubmissionView
