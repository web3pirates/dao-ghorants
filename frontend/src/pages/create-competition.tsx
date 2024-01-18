// pages/competition.js
import { useState } from 'react'
import styled from 'styled-components'

import { Nav } from '@/components/Nav'
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Layout,
} from '@/components/atoms'

// Page component
const CreateCompetitionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    numberOfPrizes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
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
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Competition Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
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
            <Label htmlFor="numberOfPrizes">Number of Prizes:</Label>
            <Input
              type="number"
              id="numberOfPrizes"
              name="numberOfPrizes"
              value={formData.numberOfPrizes}
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
