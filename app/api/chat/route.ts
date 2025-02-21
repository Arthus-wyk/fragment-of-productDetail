
import { Duration } from '@/lib/duration'
import { getModelClient, getDefaultMode } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { backgroundPrompt, layoutPrompt, toPrompt } from '@/lib/prompt'
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
    userID,
    config,
    step,
    backgroundColor,
  }: {
    messages: CoreMessage[]
    userID: string
    config: LLMModelConfig
    step:number
    backgroundColor?:string
  } = await req.json()

  const limit = !config.apiKey
    ? await ratelimit(
        userID,
        rateLimitMaxRequests,
        ratelimitWindow,
      )
    : false

  if (limit) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.amount.toString(),
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.reset.toString(),
      },
    })
  }
  const prompt:{ [key: number]: string }={
    0:backgroundPrompt,
    1:layoutPrompt(backgroundColor),

  }

  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
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
      ...modelParams,
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
