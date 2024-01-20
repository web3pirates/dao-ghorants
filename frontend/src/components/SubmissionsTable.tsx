import { useRouter } from 'next/router'
import React from 'react'

import { submissions } from '@/utils/data'

import { Button, StyledTable } from './atoms'

interface Props {
  proposalId: number
}
const SubmissionsTable = (props: Props) => {
  const { proposalId } = props
  const router = useRouter()

  const projects = submissions.filter((s) => s.proposalId === proposalId)

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>Title</th>
          <th>Address</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((submission, index) => (
          <tr key={index}>
            <td>{submission.title}</td>
            <td>{submission.address}</td>
            <td>
              <Button
                onClick={() => router.push(`/submission/${submission.id}`)}
              >
                Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  )
}

export default SubmissionsTable
