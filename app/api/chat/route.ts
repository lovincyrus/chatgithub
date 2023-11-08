import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { GPTTokens } from 'gpt-tokens'
import { OpenAI } from 'openai'

import { functions, runFunction } from './functions'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ip = req.headers.get('x-forwarded-for')
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, '1 d')
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `chatgithub_ratelimit_${ip}`
    )

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      })
    }
  }

  const { messages, aiToken } = await req.json()

  const openai = new OpenAI({
    apiKey: aiToken ? aiToken : process.env.OPENAI_API_KEY
  })

  const initialResponse = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages,
    stream: true,
    functions,
    function_call: 'auto'
  })

  const usageInfo = new GPTTokens({
    model: 'gpt-4-1106-preview',
    messages: messages
  })

  // eslint-disable-next-line no-console
  console.log({
    'Tokens prompt': usageInfo.promptUsedTokens,
    'Tokens completion': usageInfo.completionUsedTokens,
    'Tokens total': usageInfo.usedTokens
  })

  // eslint-disable-next-line no-console
  console.log('Price USD: ', usageInfo.usedUSD)

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      const result = await runFunction(name, args)
      const newMessages = createFunctionCallMessages(result)
      return openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        stream: true,
        messages: [...messages, ...newMessages]
      })
    }
  })

  return new StreamingTextResponse(stream)
}
