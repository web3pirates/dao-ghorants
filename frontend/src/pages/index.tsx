import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useAccount, useEnsAddress, useEnsName } from 'wagmi'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useIsMounted } from '@/hooks/useIsMounted'

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
        <title>DAO Gho Grants</title>
        <meta name="description" content="" />

        <meta property="og:image" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>

      <Layout>
        <Nav />

        <Container
          as="main"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <h1>DAO GHO Grants</h1>
          <p>
            The cutting-edge solution designed to revolutionize the way
            hackathon prizes are distributed.
          </p>

          <p>
            Our tool leverages <b>advanced analytics</b> and <b>AI</b> to
            provide a fair and comprehensive evaluation of participants{' '}
            <b>Github repositories</b>, ensuring that recognition is based on
            merit and contribution quality.
          </p>

          {/* If the page is hydrated and the user is connected, show their address */}
          {isMounted && address ? (
            <p>Connected with {ensName ?? address}</p>
          ) : (
            <ConnectButton />
          )}
        </Container>

        <Footer />
      </Layout>
    </>
  )
}
