import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Button, CustomContainer, Layout } from '@/components/atoms'

const CompetitionDetail = () => {
  const router = useRouter()
  const { id } = router.query

  // Dummy data for the example. Replace this with your actual data fetching logic
  const competition = {
    imageUrl: '/images/hackathon1.png',
    title: 'Global Code Challenge',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    prize: '10000 USD',
    description: 'This is a detailed description of the Global Code Challenge.',
    githubUrl: 'https://github.com/example-repo', // TODO: Replace with actual GitHub URL
  }

  const handleApproveAndSendGrant = () => {
    console.log('Approving project and sending grant...')
  }

  return (
    <>
      <Head>
        <title>{competition.title} - DAO GHO Grants</title>
        <meta name="description" content={`Details of ${competition.title}`} />
        {/* ... other meta tags */}
      </Head>

      <Layout>
        <Nav />

        <CustomContainer as="main" className="py-10">
          <Link href="/">
            <p className="text-blue-600 hover:underline">
              Back to competitions
            </p>
          </Link>

          <div className="mt-6">
            <img
              src={competition.imageUrl}
              alt={competition.title}
              className="rounded-lg w-full object-cover h-64"
            />

            <h1 className="text-4xl font-bold mt-4">{competition.title}</h1>
            <p className="text-lg mt-2">{competition.description}</p>

            <div className="mt-4">
              <span className="font-medium">Start Date:</span>{' '}
              {competition.startDate}
            </div>
            <div>
              <span className="font-medium">End Date:</span>{' '}
              {competition.endDate}
            </div>
            <div>
              <span className="font-medium">Prize:</span> {competition.prize}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <Button>
              <a
                href={competition.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                See project on GitHub
              </a>
            </Button>
            <Button>Analyze Metrics</Button>
            <Button onClick={handleApproveAndSendGrant}>
              Approve Project and Send Grant
            </Button>
          </div>
        </CustomContainer>

        <Footer />
      </Layout>
    </>
  )
}

export default CompetitionDetail
