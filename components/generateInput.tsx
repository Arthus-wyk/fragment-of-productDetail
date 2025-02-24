'use client'

import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import GenerateProgress from '@/components/generateProgress'
import { NavBar } from '@/components/navbar'
import { Preview } from '@/components/preview'
import { AuthViewType, useAuth } from '@/lib/auth'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { basePrompt } from '@/lib/prompt'
import { artifactSchema, ArtifactSchema } from '@/lib/schema'
import { TemplateId } from '@/lib/templates'
import { ExecutionResult, questionQuery } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { addNewMessage, getMessageList } from '@/lib/utils/supabase/queries'
import { useQuery } from '@tanstack/react-query'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { Form } from 'antd'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function GenerateInput({
  result,
  setLoading,
  setResult,
  progress,
  chat_id,
}: {
  result: ExecutionResult | undefined
  setLoading: (isloading: boolean) => void
  setResult: (result: ExecutionResult | undefined) => void
  progress: number
  chat_id: string
}) {
  const [chatInput, setChatInput] = useLocalStorage('chat', '')
  const [files, setFiles] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
    'auto',
  )
  const [form] = Form.useForm()

  const posthog = usePostHog()
  const [messages, setMessages] = useState<Message[]>([])
  const [codeMessage, setCodeMessages] = useState<Message>()
  const [fragment, setFragment] = useState<DeepPartial<ArtifactSchema>>()
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const { session, apiKey } = useAuth(setAuthDialog, setAuthView)
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
          await addNewMessage(
            supabase,
            chat_id,
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

  const { data: messageData } = useQuery({
    queryKey: ['getMessages'],
    queryFn: async () => {
      const messages = await getMessageList(supabase, chat_id)
      return messages // 确保返回数据
    },
  })

  useEffect(()=>{
    if(result){
      setCodeMessages({
        role:'user',
        content:[{
          type:'code',
          text:result.code
        }]
      })
    }
  },[result])


  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  //接收到模型的消息，加入消息队列
  useEffect(() => {
    if (object) {
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

    const updatedMessages = codeMessage
      ? [
          codeMessage,
          ...addMessage({
            role: 'user',
            content,
          }),
        ]
      : addMessage({
          role: 'user',
          content,
        })

    submit({
      messages: toAISDKMessages(updatedMessages),
      step: progress,
    })
    await addNewMessage(
      supabase,
      chat_id,
      'user',
      chatInput,
      '',
      '',
      '',
    )
    setChatInput('')
    setFiles([])
  }

  function retry() {
    const sendMessage = codeMessage ? [codeMessage, ...messages] : messages
    submit({
      messages: toAISDKMessages(sendMessage),
      step: progress,
    })
  }

  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message])
    return [...messages, message]
  }

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
