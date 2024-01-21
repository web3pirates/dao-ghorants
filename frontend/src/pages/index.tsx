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
  TinyLabelCard,
  Title,
} from '@/components/atoms'
import { useDB } from '@/hooks/useDB'
import { useIsMounted } from '@/hooks/useIsMounted'

export default function Home() {
  const isMounted = useIsMounted() // Prevent Next.js hydration errors
  const router = useRouter()
  const { fetchCompetitions } = useDB()

  const competitions = useAsyncMemo(async () => await fetchCompetitions(), [])

  const getBackgroundColor = (typeOfGrant: string) => {
    switch (typeOfGrant) {
      case 'project':
        return { backgroundColor: '#00b300' }
      case 'bounty':
        return { backgroundColor: '#ffcc00' } // Choose your color for bounty
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
              <HackathonsContainer>
                {!!competitions &&
                  competitions.map((competition, index) => (
                    <HackathonBox
                      key={index}
                      onClick={() =>
                        router.push(`competition/${competition._id}`)
                      }
                    >
                      <img
                        src={competition.imageUrl}
                        alt={`Hackathon ${index + 1}`}
                      />
                      <h3>{competition.title}</h3>
                      <TinyLabelCard
                        style={getBackgroundColor(
                          competition.typeOfGrant || 'project'
                        )}
                      >
                        {competition.typeOfGrant || 'project'}
                      </TinyLabelCard>
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
