import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAsyncMemo } from 'use-async-memo'
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
  TextArea,
  Title,
} from '@/components/atoms'
import { useGithub } from '@/hooks/useGithub'
import { http } from '@/utils/fetch'
import { useSharedState } from '@/utils/store'

// Page component
const CreateSubmissionPage = () => {
  const [user] = useSharedState()
  const [repoSelected, setRepoSelected] = useState('')
  const { fetchUserRepos } = useGithub()
  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: '',
    address: '',
    description: '',
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

  const userReposFetched = useAsyncMemo(async () => {
    const res = await fetchUserRepos(user.user.login)

    return res
  }, [user])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      address: address || '',
      proposalId: Number(router.query.competition),
    }))
  }, [address, router.query])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      await http({
        method: 'POST',
        form: formData,
        json: true,
        url: '/submissions',
      })

      router.push(`/competition/${router.query.competition}`)
    } catch (e) {
      console.error(e)
    }
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
          {userReposFetched && (
            <select
              name="select"
              onChange={(e) => {
                console.log('inside change')
                console.log(
                  userReposFetched.find((repo) => {
                    return repo.fullName === e.target.value
                  }).url
                )
                setRepoSelected(e.target.value)

                setFormData((prev) => {
                  const repo = userReposFetched.find((repo) => {
                    return repo.fullName === e.target.value
                  })
                  return {
                    ...prev,
                    githubUrl: repo.url,
                    description: repo.description,
                    title: repo.name,
                  }
                })
              }}
              style={{ color: 'black', marginBottom: '1rem' }}
            >
              {userReposFetched.map(function (repo) {
                return (
                  <option
                    value={repo.fullName}
                    selected={repoSelected === repo.FullName}
                    style={{ color: 'black' }}
                  >
                    {repo.fullName}
                  </option>
                )
              })}
            </select>
          )}
          <FormGroup>
            <Label htmlFor="title">Project Name:</Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Enter project name"
              value={formData.title}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="title">Describe your project:</Label>
            <TextArea
              id="description"
              name="description"
              placeholder="Enter submission description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
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
