import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import { useAccount, useEnsName } from 'wagmi'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useIsMounted } from '@/hooks/useIsMounted'

// Add some custom styles
const CustomContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  padding: 2rem;
`

const CreateButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`

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
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}
