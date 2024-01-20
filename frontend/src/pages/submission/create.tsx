import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAccount } from 'wagmi'

import { Nav } from '@/components/Nav'
import {
  Button,
  Container,
  Description,
  Form,
  FormGroup,
  Input,
  Label,
  Layout,
  Title,
} from '@/components/atoms'

// Page component
const CreateSubmissionPage = () => {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: '',
    address: '',
    githubUrl: '',
    proposalId: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const { address } = useAccount()
  const router = useRouter()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ['address']: address || '',
      ['proposalId']: Number(router.query.proposal),
    }))
  }, [address, router.query])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Handle form submission logic here
    setIsLoading(true)

    //save submission to DB
    setIsLoading(false)
  }

  return (
    <Layout>
      <Nav />

      <Container
        as="main"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Title>Submit your project</Title>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Project Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter project name"
              value={formData.title}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="githubUrl">Github repo URL:</Label>
            <Input
              type="text"
              id="githubUrl"
              name="githubUrl"
              placeholder="https://github.com/your-repository"
              value={formData.githubUrl}
              onChange={handleChange}
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </Form>
      </Container>
    </Layout>
  )
}

export default CreateSubmissionPage
