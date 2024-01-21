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
  const [showAwardButton, setShowAwardButton] = useState(false)
  const router = useRouter()
  const {
    giveScoreForRepo,
    judgeRepo,
    checkCreativity,
    checkImpact,
    checkReliability,
    checkUseOfBlockchain,
    checkPlagiarized,
    checkCollaboration,
  } = useOpenAI()
  const { address } = useAccount()
  const { fetchSubmission, fetchCompetition, fetchJudgement } = useDB()
  const { fetchRepoInfo } = useGithub()
  const { id } = router.query

  const submission = useAsyncMemo(async () => {
    if (!id) return
    return await fetchSubmission(id as string)
  }, [router.query])

  const judgement = useAsyncMemo(async () => {
    if (!id) return
    return await fetchJudgement(id as string)
  }, [router.query, gptJudgement])

  const repoInfo = useAsyncMemo(async () => {
    if (!submission) return

    // const owner = submission.githubUrl.split('/')[3]
    const owner = 'wagmi'
    return await fetchRepoInfo(owner, submission.githubUrl)
  }, [submission])

  const proposal = useAsyncMemo(async () => {
    try {
      if (!submission) return
      return await fetchCompetition(submission.proposalId)
    } catch (e) {
      console.error(e)
    }
  }, [submission])

  const isProposalAdmin = useMemo(
    () => address === proposal?.admin,
    [address, proposal]
  )

  const scoreIsGood = useMemo(() => score && score > 75, [score])

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

    const creativity = await checkCreativity(
      proposal.description,
      submission.githubUrl
    )

    const impact = await checkImpact(proposal.description, submission.githubUrl)

    // const reliability = await checkReliability(
    //   proposal.description,
    //   submission.githubUrl
    // )

    const useOfBlockchain = await checkUseOfBlockchain(
      proposal.description,
      submission.githubUrl
    )

    const plagiarized = await checkPlagiarized(
      proposal.description,
      submission.githubUrl
    )

    // const collaboration = await checkCollaboration(
    //   proposal.description,
    //   submission.githubUrl
    // )

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
      creativity,
      useOfBlockchain,
      impact,
      plagiarized,
      // collaboration,
      // reliability,
    }

    try {
      const newJudgement = await http({
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
    setShowAwardButton(true)
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
            ) : !!judgement ? (
              <div>
                <GPTDescription>
                  Repository has been analyzed on the{' '}
                  <b>
                    {new Date(judgement.updatedAt).toLocaleTimeString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </b>
                </GPTDescription>
                <GPTDescription>
                  Reviewed by <b>{judgement.judgeAddress}</b>
                </GPTDescription>
                <GPTDescription>
                  <b>
                    Quick overview of the project in relation to the
                    requirements and reliability. (Max 4 sentences)
                  </b>
                  <br />
                  <div>{judgement.chatGptJudgement}</div>
                </GPTDescription>
                {judgement.plagiarized !== undefined ? (
                  <GPTDescription>
                    <b>
                      Plagiarism Check: Is this a unique project? Does it have
                      any similarities?
                    </b>
                    <br />
                    <div>{judgement.plagiarized}</div>
                  </GPTDescription>
                ) : null}
                {judgement.creativity !== undefined ? (
                  <GPTDescription>
                    <b>
                      Creativity and Innovation: Does the project showcase
                      original and forward-thinking ideas in the blockchain
                      space? Does it push the boundaries of whats possible with
                      blockchain technology?
                    </b>
                    <br />
                    <div>{judgement.creativity}</div>
                  </GPTDescription>
                ) : null}
                {judgement.useOfBlockchain !== undefined ? (
                  <GPTDescription>
                    <b>
                      Use of Blockchain: Does the project leverage blockchain
                      technology effectively? Does it demonstrate a deep
                      understanding of blockchain concepts and their
                      application?
                    </b>
                    <br />
                    <div>{judgement.useOfBlockchain}</div>
                  </GPTDescription>
                ) : null}
                {judgement.impact !== undefined ? (
                  <GPTDescription>
                    <b>
                      Impact and Social Good: Does the project address social or
                      environmental challenges? Does it have the potential to
                      create a positive impact on society?
                    </b>
                    <br />
                    <div>{judgement.impact}</div>
                  </GPTDescription>
                ) : null}
                {judgement.collaboration !== undefined ? (
                  <GPTDescription>
                    <b>
                      4. Collaboration and Contribution: Does the project
                      encourage collaboration and engagement with like-minded
                      individuals? Does it provide opportunities for
                      participants to contribute to the evolving world of
                      blockchain innovation?
                    </b>
                    <br />
                    <div>{judgement.collaboration}</div>
                  </GPTDescription>
                ) : null}
                {judgement.reliability !== undefined ? (
                  <GPTDescription>
                    <b>
                      5. Reliability: Is the project well-documented and
                      maintained? Are there any known issues or bugs? Does it
                      have a clear roadmap or plan for future development?
                    </b>
                    <br />
                    <div>{judgement.reliability}</div>
                  </GPTDescription>
                ) : null}
                <GPTDescription>
                  {' '}
                  The repository has a score of <b>
                    {judgement.chatGptScore}
                  </b>{' '}
                  out of 100.
                </GPTDescription>
                {judgement.chatGptScore > 75 ? (
                  <GPTDescription
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  >
                    {' '}
                    This is a good score! 🚀🚀{' '}
                  </GPTDescription>
                ) : (
                  <GPTDescription
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  >
                    {' '}
                    This is a bad score! 😭😭{' '}
                  </GPTDescription>
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

          {isProposalAdmin && showAwardButton && (
            <Row>
              <Button onClick={awardPrize} disabled={isTransacting}>
                Accept and Award Prize
              </Button>
            </Row>
          )}
        </CustomContainer>
      </Layout>
    </>
  )
}

export default SubmissionView
