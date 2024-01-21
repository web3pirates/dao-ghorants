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
  const { fetchJudgements, fetchSubmissions } = useDB()

  const submissions = useAsyncMemo(
    async () => await fetchSubmissions(proposalId),
    [proposalId]
  )

  const judgements = useAsyncMemo(async () => {
    if (submissions && submissions[0]) {
      return await fetchJudgements()
    }
    // Handle the case where submissions or submissions[0] is undefined
    return null
  }, [submissions])

  // console.log(JSON.stringify(judgements))

  type JudgementType = {
    _id: string
    proposalId: string
    submissionId: string
    chatGptScore: number

    // Add other properties as needed
  }

  const matchJudgement = (submissionId: string): JudgementType | null => {
    if (judgements) {
      const foundJudgement = judgements.find(
        (judgement: JudgementType) => judgement.submissionId === submissionId
      )

      return foundJudgement || null
    }

    return null
  }

  // console.log('judgements', judgements)

  if (submissions?.length === 0)
    return <Description>No submissions yet</Description>
  return (
    <StyledTable>
      <thead>
        <tr>
          <th>Title</th>
          <th>Address</th>
          <th>Score</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {!!submissions &&
          submissions.map((submission, index) => (
            <tr key={index}>
              <td>{submission.title}</td>
              <td>{submission.address}</td>
              <td>{matchJudgement(submission.id)?.chatGptScore}</td>
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
