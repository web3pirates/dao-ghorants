import styled from 'styled-components'

import { mq } from '@/styles/breakpoints'

export const Layout = styled.div`
  // Vertically centered layout
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f4f7fa;
  color: #1d3b3b;
  gap: 3rem;

  width: 100%;
  padding: 2rem;
  min-height: 100svh;

  @media ${mq.sm.max} {
    padding: 1rem;
  }
`

export const Container = styled.div`
  width: 100%;
  max-width: 35rem;
  margin-left: auto;
  margin-top: 10rem;
  margin-right: auto;
`

export const Form = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

export const FormGroup = styled.div`
  margin-bottom: 15px;
`

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`

export const CustomContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  padding: 2rem;
`

export const CreateButton = styled.button`
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

export const Title = styled.h1`
  font-size: 2rem;
  color: #1d3b3b;
  text-align: center;
  margin-bottom: 1.5rem;
`

export const Description = styled.p`
  text-align: center;
  color: #6c757d;
  margin-bottom: 2rem;
`

export const HackathonBox = styled.div`
  background-color: #d2deff;
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  padding: 1rem;
  width: 300px;
  text-align: left;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 0.25rem;
  }

  h3 {
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }

  p {
    margin: 0.5rem 0;
  }
`

export const HackathonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`
