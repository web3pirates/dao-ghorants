import React from 'react'

import { submissions } from '@/utils/data'

import { Button, StyledTable } from './atoms'

interface Props {
  slug: string
}
const SubmissionsTable = (props: Props) => {
  const { slug } = props

  const projects = submissions.filter((s) => s.slug === slug)
  const handleApproveAndSendGrant = () => {
    console.log('Approving project and sending grant...')
  }

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>Title</th>
          <th>Address</th>
          <th>Project</th>
          <th>Analyze</th>
          <th>Appove</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((submission, index) => (
          <tr key={index}>
            <td>{submission.title}</td>
            <td>{submission.address}</td>
            <td>
              <Button
                as="a"
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </td>
            <td>
              <Button>Analyze Metrics</Button>
            </td>
            <td>
              <Button onClick={handleApproveAndSendGrant}>
                Approve Project and Send Grant
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  )
}

export default SubmissionsTable
