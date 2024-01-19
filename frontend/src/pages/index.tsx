import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
import { hackathons } from '@/utils/data'

export default function Home() {
  const isMounted = useIsMounted() // Prevent Next.js hydration errors
  const { address } = useAccount() // Get the user's connected wallet address
  const router = useRouter()

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
              <HackathonBox
                key={index}
                onClick={() => router.push(`competition/${hackathon.slug}`)}
              >
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
