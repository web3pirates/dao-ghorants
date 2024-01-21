import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useAsyncMemo } from 'use-async-memo'
import { useAccount } from 'wagmi'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import SubmissionsTable from '@/components/SubmissionsTable'
import {
  Button,
  CustomContainer,
  Description,
  Layout,
  Row,
  StyledDetail,
  StyledImage,
  Title,
} from '@/components/atoms'
import { useDB } from '@/hooks/useDB'
import { useSharedState } from '@/utils/store'

const CompetitionDetail = () => {
  const router = useRouter()
  const { address } = useAccount()
  const [{ isLoggedIn }] = useSharedState()
  const { fetchCompetition } = useDB()
  const { id } = router.query

  const competition = useAsyncMemo(async () => {
    if (!id) return
    return await fetchCompetition(id as string)
  }, [id])

  const isAdmin = useMemo(
    () => competition?.admin === address,
    [competition, address]
  )

  if (!competition) return <p>Loading...</p>
  return (
    <>
      <Head>
        <title>{competition.title} - 💰 GHO Grants</title>
        <meta name="description" content={`Details of ${competition.title}`} />
      </Head>

      <Layout>
        <Nav />

        <CustomContainer as="main">
          {/* <Link href="/">
            <p>Back to competitions</p>
          </Link> */}

          <StyledImage src={competition.imageUrl} alt={competition.title} />

          <Title>{competition.title}</Title>
          <Description>{competition.description}</Description>
          <Row>
            <StyledDetail>
              <span>Starts at:</span>{' '}
              {new Date(competition.startDate).toDateString()}
            </StyledDetail>
            <StyledDetail>
              <span>Ends at:</span>{' '}
              {new Date(competition.endDate).toDateString()}
            </StyledDetail>
            <StyledDetail>
              <span>Prize:</span> {competition.prize} GHO
            </StyledDetail>
          </Row>

          <Title>Submissions</Title>
          {!isAdmin &&
            (isLoggedIn ? (
              <Link
                href={`/submission/create?competition=${competition._id}`}
                passHref
              >
                <Button>Submit your project</Button>
              </Link>
            ) : (
              <Link href={`/login`} passHref style={{ width: 'fit-content' }}>
                <Button>Login with GitHub</Button>
              </Link>
            ))}
          <SubmissionsTable proposalId={competition._id} />
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}

export default CompetitionDetail
