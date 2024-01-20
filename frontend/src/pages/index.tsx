import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAsyncMemo } from 'use-async-memo'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import {
  CreateButton,
  CustomContainer,
  HackathonBox,
  HackathonsContainer,
  Layout,
  Title,
} from '@/components/atoms'
import { useDB } from '@/hooks/useDB'
import { useIsMounted } from '@/hooks/useIsMounted'

export default function Home() {
  const isMounted = useIsMounted() // Prevent Next.js hydration errors
  const router = useRouter()
  const { fetchCompetitions } = useDB()

  const competitions = useAsyncMemo(async () => await fetchCompetitions(), [])

  return (
    <>
      <Head>
        <title>DAO GHO Grants</title>
        <meta
          name="description"
          content="Revolutionizing hackathon prize distribution."
        />
        {/* ... other meta tags */}
      </Head>

      <Layout>
        <Nav />

        <CustomContainer as="main">
          <h1>DAO GHO Grants</h1>
          <p>
            The cutting-edge solution designed to revolutionize the way
            hackathon prizes are distributed.
          </p>
          <p>
            Our tool leverages <b>advanced analytics</b> and <b>AI</b> to
            provide a fair and comprehensive evaluation of participants&apos;{' '}
            <b>Github repositories</b>, ensuring that recognition is based on
            merit and contribution quality.
          </p>

          <Link href="/competition/create" passHref>
            <CreateButton>Create Competition</CreateButton>
          </Link>

          <p></p>
          <br />

          <Title>Search your favourite competition</Title>
          <HackathonsContainer>
            {!!competitions &&
              competitions.map((competition, index) => (
                <HackathonBox
                  key={index}
                  onClick={() => router.push(`competition/${competition.id}`)}
                >
                  <img
                    src={competition.imageUrl}
                    alt={`Hackathon ${index + 1}`}
                  />
                  <h3>{competition.title}</h3>
                  <p>
                    Start Date: {new Date(competition.startDate).toDateString()}
                  </p>
                  <p>
                    End Date: {new Date(competition.endDate).toDateString()}
                  </p>
                  <p>Prize: {competition.prize} GHO</p>
                </HackathonBox>
              ))}
          </HackathonsContainer>
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}
