import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider'
import { createVertex } from '@ai-sdk/google-vertex'

export type LLMModel = {
  id: string
  name: string
  provider: string
  providerId: string
}

export type LLMModelConfig = {
  model?: string
  apiKey?: string
  baseURL?: string
  temperature?: number
  topP?: number
  topK?: number
  frequencyPenalty?: number
  presencePenalty?: number
  maxTokens?: number
}

export function getModelClient(model: LLMModel, config: LLMModelConfig) {
  const { id: modelNameString, providerId } = model
  const { apiKey, baseURL } = config
  console.log("modelNameString:",modelNameString)

  const providerConfigs = {
    anthropic: () => createAnthropic({ apiKey, baseURL })(modelNameString),
    openai: () => createOpenAI({ apiKey, baseURL })(modelNameString),
    google: () =>
      createGoogleGenerativeAI({
         apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY,
         baseURL
        })(modelNameString),
    mistral: () => createMistral({ apiKey, baseURL })(modelNameString),
    groq: () =>
      createOpenAI({
        apiKey: apiKey || process.env.GROQ_API_KEY,
        baseURL: baseURL || 'https://api.groq.com/openai/v1',
      })(modelNameString),
    togetherai: () =>
      createOpenAI({
        apiKey: apiKey || process.env.TOGETHER_AI_API_KEY,
        baseURL: baseURL || 'https://api.together.xyz/v1',
      })(modelNameString),
    ollama: () => createOllama({ baseURL })(modelNameString),
    fireworks: () =>
      createOpenAI({
        apiKey: apiKey || process.env.FIREWORKS_API_KEY,
        baseURL: baseURL || 'https://api.fireworks.ai/inference/v1',
      })(modelNameString),
    vertex: () => createVertex({ googleAuthOptions: { credentials: JSON.parse(process.env.GOOGLE_VERTEX_CREDENTIALS || '{}') } })(modelNameString),
    baidu: () => createOpenAI({ apiKey: process.env.BAIDU_API_KEY, baseURL:  'https://aip.baidubce.com/rest/2.0/ocr/v1' })(modelNameString),

  }

  const createClient =
    providerConfigs[providerId as keyof typeof providerConfigs]

  if (!createClient) {
    throw new Error(`Unsupported provider: ${providerId}`)
  }

  return createClient()
}

export function getDefaultMode(model: LLMModel) {
  const { id: modelNameString, providerId } = model

  // monkey patch fireworks
  if (providerId === 'fireworks') {
    return 'json'
  }

  return 'auto'
}
