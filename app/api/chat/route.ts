
import { Duration } from '@/lib/duration'
import { getModelClient, getDefaultMode } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { toPrompt } from '@/lib/prompt'
import ratelimit from '@/lib/ratelimit'
import { fragmentSchema as schema } from '@/lib/schema'
import { Templates } from '@/lib/templates'
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
    template,
    model,
    config,
  }: {
    messages: CoreMessage[]
    userID: string
    template: Templates
    model: LLMModel
    config: LLMModelConfig
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


  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
  const modelClient = getModelClient(model, config)
  console.log("tem:",template)


  try{
    console.log("系统提示词：",toPrompt())
    console.log("用户提示词：",messages)
    const stream = await streamObject({
      model: modelClient as LanguageModel,
      schema,
      system: toPrompt(),
      messages,
      mode: getDefaultMode(model),
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

  // console.log('stream',stream)



}
