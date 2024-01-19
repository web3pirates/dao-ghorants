import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

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
  const { id } = router.query

  const competition = useMemo(() => {
    if (!id) return
    return hackathons.filter((h) => h.slug === id)[0]
  }, [id])

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
              <span>Prize:</span> {competition.prize}
            </StyledDetail>
          </Row>

          <Title>Submissions</Title>
          <SubmissionsTable slug={id as string} />
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}

export default CompetitionDetail
