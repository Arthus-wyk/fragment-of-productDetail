'use client'

import { AuthDialog } from '@/components/auth-dialog'
import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import Form from '@/components/form'
import GenerateInput from '@/components/generateInput'
import GenerateProgress from '@/components/generateProgress'
import GradientBackgroundPicker from '@/components/gradientBackgroundPicker'
import { NavBar } from '@/components/navbar'
import { Preview } from '@/components/preview'
import { AuthViewType, useAuth } from '@/lib/auth'
import { backgroundPrompt, create_prompt } from '@/lib/create_prompt'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { LLMModelConfig } from '@/lib/models'
import modelsList from '@/lib/models.json'
import { artifactSchema, ArtifactSchema } from '@/lib/schema'
import templates, { TemplateId } from '@/lib/templates'
import { ExecutionResult, questionQuery } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import {
  addNewChat,
  addNewMessage,
  getMessageList,
} from '@/lib/utils/supabase/queries'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { useRouter } from 'next/router'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useTemplateContext } from '../template'

export default function WebGeneratorBackground() {
  const { isChatLoading, result } = useTemplateContext();

  return (
        <GradientBackgroundPicker
          isChatLoading={isChatLoading}
          result={result}
        />
  )
}
