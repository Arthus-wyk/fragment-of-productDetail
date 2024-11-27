
import { Duration } from '@/lib/duration'
import { getModelClient, getDefaultMode } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { toPrompt } from '@/lib/prompt'
import ratelimit from '@/lib/ratelimit'
import { fragmentSchema as schema } from '@/lib/schema'
import { Templates } from '@/lib/templates'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { CoreMessage, LanguageModel, streamObject } from 'ai'
import { error } from 'console'

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

  console.log('userID', userID)
  console.log('template',template)
  console.log('template to prompt', toPrompt(template))

  console.log('model', model)
  console.log('config', config)

  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
  const client = createGoogleGenerativeAI({ apiKey : process.env.GOOGLE_GENERATIVE_AI_API_KEY})
  ('models/gemini-1.5-flash-latest')


  try{
    const stream = await streamObject({
      model: client as LanguageModel,
      schema,
      system: toPrompt(template),
      messages,
      mode: getDefaultMode(model),
      ...modelParams,
      maxRetries:10
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
