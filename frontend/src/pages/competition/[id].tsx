import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
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
import { hackathons } from '@/utils/data'

const CompetitionDetail = () => {
  const router = useRouter()
  const { address } = useAccount()
  const { id } = router.query

  const competition = useMemo(() => {
    if (!id) return
    return hackathons.filter((h) => h.id === Number(id))[0]
  }, [id])

  const isAdmin = useMemo(
    () => competition?.admin === address,
    [competition, address]
  )

  if (!competition) return <p>Loading...</p>
  return (
    <>
      <Head>
        <title>{competition.title} - DAO GHO Grants</title>
        <meta name="description" content={`Details of ${competition.title}`} />
      </Head>

      <Layout>
        <Nav />

        <CustomContainer as="main">
          <Link href="/">
            <p>Back to competitions</p>
          </Link>

          <StyledImage src={competition.imageUrl} alt={competition.title} />

          <Title>{competition.title}</Title>
          <Description>{competition.description}</Description>
          <Row>
            <StyledDetail>
              <span>Starts at:</span> {competition.startDate}
            </StyledDetail>
            <StyledDetail>
              <span>Ends at:</span> {competition.endDate}
            </StyledDetail>
            <StyledDetail>
              <span>Prize:</span> {competition.prize} GHO
            </StyledDetail>
          </Row>

          <Row>
            <Title>Submissions</Title>
            {!isAdmin && (
              <Link
                href={`/submission/create?competition=${competition.id}`}
                passHref
              >
                <Button>Submit your project</Button>
              </Link>
            )}
          </Row>
          <SubmissionsTable proposalId={competition.id} />
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}

export default CompetitionDetail
