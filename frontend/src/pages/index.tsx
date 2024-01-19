import Head from 'next/head'
import Link from 'next/link'
import { useAccount, useEnsName } from 'wagmi'

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
import { useIsMounted } from '@/hooks/useIsMounted'

const hackathons = [
  {
    imageUrl: '/images/hackathon1.png',
    title: 'Global Code Challenge',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    prize: '10000 USD',
  },
  {
    imageUrl: '/images/hackathon2.png',
    title: 'Innovators Hackfest',
    startDate: '2024-04-22',
    endDate: '2024-04-24',
    prize: '7500 USD',
  },
  {
    imageUrl: '/images/hackathon3.png',
    title: 'AI Revolution Contest',
    startDate: '2024-05-05',
    endDate: '2024-05-07',
    prize: '12000 USD',
  },
  {
    imageUrl: '/images/hackathon4.png',
    title: 'Green Tech Marathon',
    startDate: '2024-06-18',
    endDate: '2024-06-20',
    prize: '8000 USD',
  },
  {
    imageUrl: '/images/hackathon5.png',
    title: 'Data Science Sprint',
    startDate: '2024-07-12',
    endDate: '2024-07-14',
    prize: '9000 USD',
  },
  {
    imageUrl: '/images/hackathon6.png',
    title: 'Blockchain Battle',
    startDate: '2024-08-09',
    endDate: '2024-08-11',
    prize: '11000 USD',
  },
]

export default function Home() {
  const isMounted = useIsMounted() // Prevent Next.js hydration errors
  const { address } = useAccount() // Get the user's connected wallet address

  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // We always want to use ETH mainnet for ENS lookups
  })

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
            provide a fair and comprehensive evaluation of participants'{' '}
            <b>Github repositories</b>, ensuring that recognition is based on
            merit and contribution quality.
          </p>

          <Link href="/create-competition" passHref>
            <CreateButton>Create Competition</CreateButton>
          </Link>

          <p></p>
          <br />

          <Title>Search your favourite competition</Title>
          <HackathonsContainer>
            {hackathons.map((hackathon, index) => (
              <HackathonBox key={index}>
                <img src={hackathon.imageUrl} alt={`Hackathon ${index + 1}`} />
                <h3>{hackathon.title}</h3>
                <p>Start Date: {hackathon.startDate}</p>
                <p>End Date: {hackathon.endDate}</p>
                <p>Prize: {hackathon.prize}</p>
              </HackathonBox>
            ))}
          </HackathonsContainer>
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}
