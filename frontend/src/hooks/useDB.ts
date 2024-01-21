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

  async function fetchCompetition(id: string): Promise<any> {
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

    return res
  }

  async function fetchSubmissions(competitionId: string): Promise<any[]> {
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
        url: `/submissions/${submissionId}`,
      })
    } catch (e) {
      console.error(e)
    }

    return res[0]
  }

  async function fetchJudgement(judgementId: string): Promise<any> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/judgements/${judgementId}`,
      })
    } catch (e) {
      console.error(e)
    }

    return res
  }

  async function fetchJudgements(): Promise<any> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/judgements`,
      })
    } catch (e) {
      console.error(e)
    }

    return res
  }

  return {
    fetchCompetition,
    fetchCompetitions,
    fetchSubmission,
    fetchSubmissions,
    fetchJudgement,
    fetchJudgements,
  }
}
