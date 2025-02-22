'use client'

import { AuthDialog } from '@/components/auth-dialog'
import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import Form from '@/components/form'
import GenerateProgress from '@/components/generateProgress'
import { NavBar } from '@/components/navbar'
import { Preview } from '@/components/preview'
import { AuthViewType, useAuth } from '@/lib/auth'
import { create_prompt } from '@/lib/create_prompt'
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
  getColor,
  getMessageList,
} from '@/lib/utils/supabase/queries'
import { useQuery } from '@tanstack/react-query'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { useRouter } from 'next/router'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function GenerateInput({
  result,
  setLoading,
  setResult,
  progress,
  backgroundColor,
}: {
  result: any
  setLoading: (isloading: boolean) => void
  setResult: (result: ExecutionResult | undefined) => void
  progress: number
  backgroundColor:string
}) {
  const [chatInput, setChatInput] = useLocalStorage('chat', '')
  const [files, setFiles] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
    'auto',
  )
  const [languageModel, setLanguageModel] = useLocalStorage<LLMModelConfig>(
    'languageModel',
    {
      model: 'claude-3-5-sonnet-latest',
    },
  )
  const [viewProp, setViewProp] = useState('')
  const posthog = usePostHog()
  const [messages, setMessages] = useState<Message[]>([])
  const [ApiMessage, setApiMessages] = useState<Message[]>([])
  const [fragment, setFragment] = useState<DeepPartial<ArtifactSchema>>()
  const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const { session, apiKey } = useAuth(setAuthDialog, setAuthView)
  const currentTemplate =
    selectedTemplate === 'auto'
      ? templates
      : { [selectedTemplate]: templates[selectedTemplate] }
  const lastMessage = messages[messages.length - 1]

  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/chat',
    schema: artifactSchema,
    onError: (error) => {
      if (error.message.includes('request limit')) {
        setIsRateLimited(true)
      }
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error) {
        console.log('fragment', fragment)

        if (fragment) {
          addNewMessage(
            supabase,
            viewProp,
            'assistant',
            fragment?.commentary || '',
            fragment?.title || '',
            fragment?.description || '',
            fragment?.code || '',
          )
          setResult({ code: fragment.code })
        }
      }
    },
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (object) {
      console.log(object)
      setFragment(object)
      const content: Message['content'] = [
        { type: 'text', text: object.commentary || '' },
        { type: 'code', text: object.code || '' },
      ]

      if (!lastMessage || lastMessage.role !== 'assistant') {
        addMessage({
          role: 'assistant',
          content,
          object,
        })
        console.log(
          '添加',
          JSON.stringify({
            role: 'assistant',
            content,
            object,
          }),
        )
      }

      if (lastMessage && lastMessage.role === 'assistant') {
        setMessage({
          content,
          object,
        })
      }
    }
  }, [object])

  useEffect(() => {
    if (error) stop()
  }, [error])

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages]
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      }

      return updatedMessages
    })
    setApiMessages((previousMessages) => {
      const updatedMessages = [...previousMessages]
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      }

      return updatedMessages
    })
  }

  async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!session) {
      return setAuthDialog(true)
    }

    if (isLoading) {
      stop()
    }

    const content: Message['content'] = [{ type: 'text', text: chatInput }]
    const images = files

    if (images.length > 0) {
      images.forEach((image) => {
        content.push({ type: 'image', image })
      })
    }

    const updatedMessages = addMessage({
      role: 'user',
      content,
    })
    submit({
      userID: session?.user?.id,
      messages: toAISDKMessages(updatedMessages),
      template: currentTemplate,
      config: languageModel,
      step:progress,
      backgroundColor,
      result:result.code
    })
    addNewMessage(supabase, viewProp, 'user', chatInput, '', '', '')

    setChatInput('')
    setFiles([])
    setCurrentTab('code')

    posthog.capture('chat_submit', {
      template: selectedTemplate,
      model: languageModel.model,
    })
  }

  function retry() {
    submit({
      userID: session?.user?.id,
      messages: toAISDKMessages(ApiMessage),
      template: currentTemplate,
      config: languageModel,
      step:progress,
      backgroundColor,
      result:result.code
    })
  }
  
  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message])
    return [...messages, message]
  }

  // function addMessage(message: Message) {
  //   setMessages((previousMessages) => [...previousMessages, message])
  //   if (messages.length == 0) {
  //     const updatedMessages = {
  //       role: message.role,
  //       content: message.content.map((con) => {
  //         if (con.type === 'code' || con.type === 'text' ) {
  //           return {
  //             type: con.type,
  //             text: r(con.text),
  //           }
  //         }
  //         return con
  //       }),
  //     }
  //     setApiMessages((previousMessages) => [
  //       ...previousMessages,
  //       updatedMessages,
  //     ])
  //     return [...ApiMessage, updatedMessages]
  //   } else {
  //     setApiMessages((previousMessages) => [...previousMessages, message])
  //     return [...ApiMessage, message]
  //   }
  // }

  function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value)
  }

  function handleFileChange(change: string[]) {
    console.log('当前图片:', change)
    setFiles(change)
  }

  function setCurrentPreview(preview: {
    fragment: DeepPartial<ArtifactSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setFragment(preview.fragment)
    setResult(preview.result)
  }

  return (
    <div className="flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto  col-span-1">
      <NavBar session={session} showLogin={() => setAuthDialog(true)} />
      <GenerateProgress currentIndex={progress} />
      <>
        <Chat
          messages={messages}
          isLoading={isLoading}
          setCurrentPreview={setCurrentPreview}
        />
        <ChatInput
          retry={retry}
          isErrored={error !== undefined}
          isLoading={isLoading}
          isRateLimited={isRateLimited}
          stop={stop}
          input={chatInput}
          handleInputChange={handleSaveInputChange}
          handleSubmit={handleSubmitAuth}
          files={files}
          handleFileChange={handleFileChange}
        />
      </>
    </div>
  )
}
