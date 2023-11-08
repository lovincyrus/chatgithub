import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'openai'

import { functions, runFunction } from './functions'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, previewToken } = await req.json()

  const openai = new OpenAI({
    apiKey: previewToken ? previewToken : process.env.OPENAI_API_KEY
  })

  const initialResponse = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages,
    stream: true,
    functions,
    function_call: 'auto'
  })

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
