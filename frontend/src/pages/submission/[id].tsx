import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { Nav } from '@/components/Nav'
import {
  Button,
  CustomContainer,
  Description,
  Layout,
  Title,
} from '@/components/atoms'
import { useOpenAI } from '@/hooks/useOpenAI'
import { CONTRACT_ADDRESS } from '@/utils/constants'
import { submissions } from '@/utils/data'

const SubmissionView = () => {
  const router = useRouter()
  const { judgeRepo } = useOpenAI()
  const [gptJudgement, setGptJudgement] = useState<string | null>(null)
  const { id } = router.query

  const submission = submissions.find((s) => s.id === id)

  if (!submission)
    return (
      <>
        <Head>Page not found</Head>
        <Layout>404 - Page not found</Layout>
      </>
    )

  const analyzeRepo = async () => {
    const judgement = await judgeRepo(
      'competition prompt',
      submission.githubUrl
    )

    setGptJudgement(judgement)
  }

  const awardPrize = async () => {
    const contractAddress = CONTRACT_ADDRESS
    //send transaction only if the wallet connected is the competition admin
  }

  return (
    <>
      <Head>{submission.title}</Head>
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

        <Button onClick={awardPrize}>Accept and Award Prize</Button>
      </Layout>
    </>
  )
}

export default SubmissionView
