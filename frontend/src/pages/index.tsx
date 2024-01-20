import Head from 'next/head'
import Image from 'next/image'
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

  console.log(competitions)

  return (
    <>
      <Head>
        <title>GHO Grants</title>
        <meta
          name="description"
          content="Revolutionizing hackathon prize distribution."
        />
        {/* ... other meta tags */}
      </Head>

      <Layout>
        <Nav />

        <CustomContainer as="main">
          <h1>💰GHO Grants</h1>
          <p>
            Streamline grant processes by enabling DAOs to effortlessly create,
            evaluate, and distribute funds.
          </p>
          <p>
            Automate grant submissions, facilitate transparent evaluation
            through smart contract-based criteria, and execute seamless fund
            distributions upon approval, enhancing efficiency and transparency
            in decentralized decision-making.
          </p>

          <Link href="/competition/create" passHref>
            <CreateButton>Create Grant</CreateButton>
          </Link>

          <p></p>
          <br />

          {competitions && competitions.length > 0 && (
            <>
              {/* <Title>Search your favourite competition</Title> */}
              <HackathonsContainer>
                {!!competitions &&
                  competitions.map((competition, index) => (
                    <HackathonBox
                      key={index}
                      onClick={() =>
                        router.push(`competition/${competition.id}`)
                      }
                    >
                      <img
                        src={competition.imageUrl}
                        alt={`Hackathon ${index + 1}`}
                      />
                      <h3>{competition.title}</h3>
                      <p>
                        Start Date:{' '}
                        {new Date(competition.startDate).toDateString()}
                      </p>
                      <p>
                        End Date: {new Date(competition.endDate).toDateString()}
                      </p>
                      <p>Prize: {competition.prize} GHO</p>
                    </HackathonBox>
                  ))}
              </HackathonsContainer>
            </>
          )}
        </CustomContainer>
        <Footer />
      </Layout>
    </>
  )
}
