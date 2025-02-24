
import { Duration } from '@/lib/duration'
import { getModelClient, getDefaultMode } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { backgroundPrompt, detailPrompt, layoutPrompt, toPrompt } from '@/lib/prompt'
import ratelimit from '@/lib/ratelimit'
import { artifactSchema as schema } from '@/lib/schema'
import { Templates } from '@/lib/templates'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { CoreMessage, LanguageModel, streamObject } from 'ai'

export const maxDuration = 60

const rateLimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 10
const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
  ? (process.env.RATE_LIMIT_WINDOW as Duration)
  : '1d'

export async function POST(req: Request) {
  const {
    messages,
    step,
  }: {
    messages: CoreMessage[]
    step:number
  } = await req.json()

  const prompt:{ [key: number]: string }={
    0:backgroundPrompt,
    1:layoutPrompt(),
    2:detailPrompt()

  }

  const modelClient = createGoogleGenerativeAI({
    apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
   })('gemini-1.5-flash-latest')


  try{
    console.log("系统提示词：",prompt[step])
    console.log("用户提示词：",messages)
    const stream = await streamObject({
      model: modelClient as LanguageModel,
      schema,
      system: prompt[step],
      messages,
      mode: 'auto',
      maxRetries:1
    })
    return stream.toTextStreamResponse()
  }
  catch(error)
  {
    console.log("error",error)
    return new Response('error.!!'+error, {
      status: 500,
    })
  }
}
