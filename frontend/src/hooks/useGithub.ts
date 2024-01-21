import { http } from '@/utils/fetch'

export function useGithub() {
  async function fetchRepoInfo(owner: string, repoUrl: string): Promise<any[]> {
    let res
    const encodedRepoUrl = encodeURIComponent(repoUrl)
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/repoinfo/${owner}/${encodedRepoUrl}`,
      })
    } catch (e) {
      console.error(e)
    }

    return res
  }

  async function fetchUserRepos(userId: string): Promise<any[]> {
    let res
    try {
      res = await http({
        method: 'GET',
        json: true,
        form: '',
        url: `/userrepos/${userId}`,
      })
    } catch (e) {
      console.error(e)
    }

    return res
  }

  return {
    fetchRepoInfo,
    fetchUserRepos,
  }
}
