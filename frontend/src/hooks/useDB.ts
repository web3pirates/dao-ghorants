import { http } from '@/utils/fetch'

export function useDB() {
  async function fetchCompetitions(): Promise<any[]> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: '/competitions',
      })
    } catch (e) {
      console.error(e)
    }

    return res
  }

  async function fetchCompetition(id: number): Promise<any> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/competitions/${id}`,
      })
    } catch (e) {
      console.error(e)
    }

    return res[0]
  }

  async function fetchSubmissions(competitionId: number): Promise<any[]> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/competitions/${competitionId}/submissions`,
      })
    } catch (e) {
      console.error(e)
    }

    return res
  }

  async function fetchSubmission(submissionId: string): Promise<any> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/submission/${submissionId}`,
      })
    } catch (e) {
      console.error(e)
    }

    return res[0]
  }

  return {
    fetchCompetition,
    fetchCompetitions,
    fetchSubmission,
    fetchSubmissions,
  }
}
