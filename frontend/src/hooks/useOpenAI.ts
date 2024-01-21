import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

if (!OPENAI_API_KEY) throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY')

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, //@dev this could expose api key if goes in production, it's ok for testing
})

export function useOpenAI() {
  async function judgeRepo(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}". 
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          You must answer with a an overview of the project in relation to the requirements and reliability. 
          You MUST express a judgement. 
          Please keep the answer at most 4 sentences.
          
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    const answer = completion.choices[0].message.content

    return answer
  }

  // 1. Creativity and Innovation: Does the project showcase original and forward-thinking ideas in the blockchain space? Does it push the boundaries of what's possible with blockchain technology?
  // 2. Use of Blockchain: Does the project leverage blockchain technology effectively? Does it demonstrate a deep understanding of blockchain concepts and their application?
  // 3. Impact and Social Good: Does the project address social or environmental challenges? Does it have the potential to create a positive impact on society?
  // 4. Collaboration and Contribution: Does the project encourage collaboration and engagement with like-minded individuals? Does it provide opportunities for participants to contribute to the evolving world of blockchain innovation?
  // 5. Reliability: Is the project well-documented and maintained? Are there any known issues or bugs? Does it have a clear roadmap or plan for future development?

  async function giveScoreForRepo(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}". 
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          Give me an score of the quality of the repo, use of blockchain, matching criteria.
          If the repo does not use of blockchain please decrease the score by 10.
          If the repo doesn not show something that impacts social good please decrease the score by 10.
          If the repo has not collaboration please decrease the score by 5.
          If the repo doesn't show reliability please decrease the score by 10.
          If the repo doesn't show creativity please decrease the score by 10.
          Please keep the answer as a number between 0 and 100`,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
    })

    const answer = completion.choices[0].message.content
    let value = 0

    if (answer !== null) value = isNaN(parseInt(answer)) ? 0 : parseInt(answer)

    return value
  }

  async function checkCreativity(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}".
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          Creativity and Innovation: Does the project showcase original and forward-thinking ideas in the blockchain space? Does it push the boundaries of what's possible with blockchain technology?
          Give an evaluation of twosentence of the creativity of the project.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    const answer = completion.choices[0].message.content
    return answer
  }

  async function checkUseOfBlockchain(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}".
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".       
          Use of Blockchain: Does the project leverage blockchain technology effectively? Does it demonstrate a deep understanding of blockchain concepts and their application?
          Give an evaluation of twosentence of the use of blockchain of the project.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    const answer = completion.choices[0].message.content
    return answer
  }

  async function checkImpact(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}".
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          Impact and Social Good: Does the project address social or environmental challenges? Does it have the potential to create a positive impact on society?
          Give an evaluation of twosentence of the impact and social good of the project.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    const answer = completion.choices[0].message.content
    return answer
  }

  async function checkCollaboration(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}".
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          Collaboration and Contribution: Does the project encourage collaboration and engagement with like-minded individuals? Does it provide opportunities for participants to contribute to the evolving world of blockchain innovation?
          Give an evaluation of twosentence of the collaboration and contribution of the project.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    const answer = completion.choices[0].message.content
    return answer
  }

  async function checkReliability(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}".
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          Reliability: Is the project well-documented and maintained? Are there any known issues or bugs? Does it have a clear roadmap or plan for future development?
          Give an evaluation of twosentence of the reliability of the project.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    const answer = completion.choices[0].message.content
    return answer
  }

  async function checkPlagiarized(prompt: string, githubUrl: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}".
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          Plagiarized: Is the project plagiarized?
          Give an evaluation of twosentence of the plagiarism of the project.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
    })

    const answer = completion.choices[0].message.content
    return answer
  }

  return {
    judgeRepo,
    giveScoreForRepo,
    checkCreativity,
    checkUseOfBlockchain,
    checkImpact,
    checkCollaboration,
    checkReliability,
    checkPlagiarized,
  }
}
