import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

if (!OPENAI_API_KEY) throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY')

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, //@dev this could expose api key if goes in production, it's ok for testing
})

export function useOpenAI() {
  async function judgeRepo(prompt: string, githubUrl: string) {
    return 'Test message to avoid calling gpt'

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a blockchain organization that needs to assure that the following gets fulfilled: "${prompt}". 
          You need to judge the result which can be found in the github repo at the url: "${githubUrl}" based on if all the requirements above were satisfied.
          Take in consideration that the project should also be functionally complete and generally reliable.
          Please respond with a couple of sentences at most.`,
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
