import { useRouter } from 'next/router'
import React from 'react'
import { useAsyncMemo } from 'use-async-memo'

import { useDB } from '@/hooks/useDB'

import { Button, Description, StyledTable } from './atoms'

interface Props {
  proposalId: string
}
const SubmissionsTable = (props: Props) => {
  const { proposalId } = props
  const router = useRouter()
  const { fetchSubmissions } = useDB()

  const submissions = useAsyncMemo(
    async () => await fetchSubmissions(proposalId),
    [proposalId]
  )

  if (submissions?.length === 0)
    return <Description>No submissions yet</Description>
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
        {!!submissions &&
          submissions.map((submission, index) => (
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
