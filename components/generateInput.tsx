'use client'

import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import GenerateProgress from '@/components/generateProgress'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { artifactSchema, ArtifactSchema } from '@/lib/schema'
import { TemplateId } from '@/lib/templates'
import { ExecutionResult, questionQuery } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { addNewMessage, getMessageList, updateCode } from '@/lib/utils/supabase/queries'
import { useQuery } from '@tanstack/react-query'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { Button, Form, Popover } from 'antd'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { ToolOutlined } from '@ant-design/icons'
import { SheetTrigger } from '@/components/ui/sheet'

export default function GenerateInput({
                                        result,
                                        setResult,
                                        progress,
                                        chat_id
                                      }: {
  result: ExecutionResult | undefined
  setResult: (result: ExecutionResult | undefined) => void
  progress: number
  chat_id: string
}) {
  const [chatInput, setChatInput] = useLocalStorage('chat', '')
  const [files, setFiles] = useState<string[]>([])
  const [tool, setTool] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
    'auto'
  )
  const [form] = Form.useForm()

  const [messages, setMessages] = useState<Message[]>([])
  const [codeMessage, setCodeMessages] = useState<Message>()
  const [fragment, setFragment] = useState<DeepPartial<ArtifactSchema>>()
  const [isRateLimited, setIsRateLimited] = useState(false)

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
        if (fragment) {
          await addNewMessage(
            supabase,
            chat_id,
            'assistant',
            fragment?.commentary || '',
            fragment?.title || '',
            fragment?.description || '',
            fragment?.code || ''
          )
          setResult({ code: fragment.code })
          updateCode(supabase, chat_id, fragment.code, 'finish')
        }
      }
    }
  })

  const { data: messageData } = useQuery({
    queryKey: ['getMessages'],
    queryFn: async () => {
      const res = await getMessageList(supabase, chat_id)
      if (res.success) {
        return messages // 确保返回数据
      } else {
        return []
      }

    }
  })

  useEffect(() => {
    if (result) {
      setCodeMessages({
        role: 'user',
        content: [{
          type: 'code',
          text: result.code
        }]
      })
    }
  }, [result])


  //接收到模型的消息，加入消息队列
  useEffect(() => {
    if (object) {
      setFragment(object)
      const content: Message['content'] = [
        { type: 'text', text: object.commentary || '' },
        { type: 'code', text: object.code || '' }
      ]

      if (!lastMessage || lastMessage.role !== 'assistant') {
        addMessage({
          role: 'assistant',
          content,
          object
        })
      }

      if (lastMessage && lastMessage.role === 'assistant') {
        setMessage({
          content,
          object
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
        ...message
      }

      return updatedMessages
    })
  }

  async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
          content
        })
      ]
      : addMessage({
        role: 'user',
        content
      })

    submit({
      messages: toAISDKMessages(updatedMessages),
      step: progress
    })
    await addNewMessage(
      supabase,
      chat_id,
      'user',
      chatInput,
      '',
      '',
      ''
    )
    setChatInput('')
    setFiles([])
  }

  function retry() {
    const sendMessage = codeMessage ? [codeMessage, ...messages] : messages
    submit({
      messages: toAISDKMessages(sendMessage),
      step: progress
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
    setFiles(change)
  }

  function setCurrentPreview(preview: {
    fragment: DeepPartial<ArtifactSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setFragment(preview.fragment)
    setResult(preview.result)
  }

  const handleToolOpen = () => {
    setTool(!tool)
    console.log(tool)
  }

  return (
    <div className="flex w-full h-full ">
      {progress !== 4 && (
        <div className="flex h-full w-12 shadow-2xl border-1 border justify-center py-4 z-1000">
          <div className="w-12 h-12 flex justify-center items-center border-y-1">
            <SheetTrigger asChild>
              <Button>
                <Popover placement="right" content="工具栏">
                  <ToolOutlined style={{ fontSize: 24 }} />
                </Popover>
              </Button>
            </SheetTrigger>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full h-full max-w-[800px] mx-auto px-4 overflow-auto  col-span-1">
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
    </div>
  )
}
