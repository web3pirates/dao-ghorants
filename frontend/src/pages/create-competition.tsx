// pages/competition.js
import { useState } from 'react'
import styled from 'styled-components'

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
const CreateCompetitionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reward: '',
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Handle form submission logic here
  }

  return (
    <Layout>
      <Nav />

      <Container
        as="main"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Title>Create Your Own Competition</Title>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Competition Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter competition name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="startDate">Start Date:</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="endDate">End Date:</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="reward">Reward for winners (USD):</Label>
            <Input
              type="number"
              id="reward"
              name="reward"
              placeholder="Enter reward in USD"
              value={formData.reward}
              onChange={handleChange}
            />
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    </Layout>
  )
}

export default CreateCompetitionPage
