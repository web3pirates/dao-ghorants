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
  LabelCard,
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

  const getBackgroundColor = (typeOfGrant: string) => {
    switch (typeOfGrant) {
      case 'project':
        return { backgroundColor: '#00b300' }
      case 'bug-hunting':
        return { backgroundColor: '#ffcc00' } // Choose your color for bug-hunting
      case 'social':
        return { backgroundColor: '#ff0000' }
      case 'translation':
        return { backgroundColor: '#9900cc' } // Choose your color for translation
      case 'documentation':
        return { backgroundColor: '#0000ff' }
      case 'hackathon':
        return { backgroundColor: '#ff00ff' }
      default:
        return { backgroundColor: '#e0e0e0' } // Default color if none of the cases match
    }
  }

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
          <LabelCard style={getBackgroundColor(competition.typeOfGrant)}>
            {competition.typeOfGrant}
          </LabelCard>
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
