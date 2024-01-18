import styled from 'styled-components'

import { mq } from '@/styles/breakpoints'

export const Layout = styled.div`
  // Vertically centered layout
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
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
