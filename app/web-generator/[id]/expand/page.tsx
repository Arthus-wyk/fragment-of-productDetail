'use client'


import ExpandModel from './expandModel'
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
import { useEffect, useState } from 'react'
import { useTemplateContext } from '../template'

export default function WebGeneratorDetail() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()

  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [isLoading, setIsLoading] = useState(false)

  const { result, setResult } = useTemplateContext()
  const {
    object,
    submit,
    isLoading: isSubmitLoading,
    stop,
    error,
  } = useObject({
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
        if (fragment) {
          setResult({ code: fragment.code })
          updateCode(supabase, chat_id, fragment.code, 'expand')
        }
      }
    },
  })

  const getCodeData = async () => {
    const res = await getCode(supabase, chat_id)
    if(!res.success){
      message.error('获取代码失败！请刷新重试')
    }
    else if (res.chat){
      setResult({ code: res.chat[0].currentCode })
    }
  }

  useEffect(() => {
    getCodeData()
  }, [])

  const { mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async () => {
      setIsLoading(true)
      if (result?.code) {
        const res = await updateCode(supabase, chat_id, result.code, 'finish')
        if (!res.success) {
          message.error('代码更新失败：' + res.error)
          setIsLoading(false)
        }
      } else {
        throw new Error('result为空')
      }
    },
    onSuccess: (data) => {
      router.push(`${basePath}/finish`)
    },
    onError: (error) => {
      setIsLoading(false)
      message.error('请求失败，请稍后重试')
    },
  })

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
    <div
      className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto"
    >
      <div className="w-full p-2">
        <Button
          onClick={() => mutateAsync()}
          loading={isLoading || isSubmitLoading}
        >
          下一步
        </Button>
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
