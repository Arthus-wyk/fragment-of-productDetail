'use client'

import { useTemplateContext } from '../template'
import DetailForm from '@/components/detailForm'
import { FragmentPreview } from '@/components/fragment-preview'
import { Message, toAISDKMessages } from '@/lib/messages'
import { expandPrompt, formPrompt } from '@/lib/prompt'
import { artifactSchema } from '@/lib/schema'
import {
  fullScreenLayout,
  originalLayout,
  splitLayout,
  verticalLayout,
} from '@/lib/templates'
import { ExecutionResult } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { getCode, updateCode } from '@/lib/utils/supabase/queries'
import { UploadOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { experimental_useObject as useObject } from 'ai/react'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Upload,
} from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ExpandModel from './expandModel'

export default function WebGeneratorDetail() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()

  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const { isChatLoading, result, setResult, backgroundColor } =
    useTemplateContext()
  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/chat',
    schema: artifactSchema,
    onError: (error) => {
      if (error.message.includes('request limit')) {
        message.error('You have reached your request limit for the day.')
      } else {
        message.error('An unexpected error has occurred.')
      }
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error) {
        console.log('fragment', fragment)
        if (fragment) setResult({ code: fragment.code })
      }
    },
  })

  const getCodeData = async () => {
    const code = await getCode(supabase, chat_id)
    if (code) setResult({ code: code[0].currentCode })
    else message.error('获取代码失败！请刷新重试')
  }

  useEffect(() => {
    getCodeData()
  }, [])
  useEffect(() => {
    setResult({ code: originalLayout(backgroundColor) })
  }, [backgroundColor])
  const { mutate } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async (name: string) => {
      if (result?.code) {
        await updateCode(supabase, chat_id, result.code, 'detail')
      }
    },
    onSuccess: (data) => {
      router.push(`${basePath}/detail`)
    },
    onError: (error) => {
      message.error('请求失败，请稍后重试')
    },
  })
  const handleNext = async () => {
    mutate
  }
  const onEditModule = (value: any) => {
    if (result) {
      const content: Message['content'] = [
        { type: 'text', text: expandPrompt(result.code, value) },
      ]
      submit({
        messages: toAISDKMessages([
          {
            role: 'user',
            content,
          },
        ] as Message[]),
        step: 2,
      })
    } else {
      message.error('当前模板为空！')
    }
  }

  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto">
      <div className="w-full p-2">
        <Button onClick={handleNext}>下一步</Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>信息</h1>
      </Divider>
      <ExpandModel onEditModule={onEditModule} />

      <div className="flex-grow overflow-auto">
        <FragmentPreview result={result} />
      </div>
    </div>
  )
}
