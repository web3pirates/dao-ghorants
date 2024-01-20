import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

if (!OPENAI_API_KEY) throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY')

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, //@dev this could expose api key if goes in production, it's ok for testing
})

export function useOpenAI() {
  async function judgeRepo(prompt: string, githubUrl: string) {
    // return 'Test message to avoid calling gpt'

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}". 
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}".
          You must answer with a an overview of the project in relation to the requirements and reliability. 
          You MUST express a judgement. 
          Please keep the answer at most 4 sentences.`,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
    })

    const answer = completion.choices[0].message.content

    return answer
  }

  return { judgeRepo }
}
