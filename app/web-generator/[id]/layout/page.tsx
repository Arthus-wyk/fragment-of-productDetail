'use client'


import StyleSelect from './styleSelect'
import { FragmentPreview } from '@/components/fragment-preview'
import { Message, toAISDKMessages } from '@/lib/messages'
import { layoutSubmitPrompt } from '@/lib/prompt'
import { artifactSchema } from '@/lib/schema'
import { originalLayout } from '@/lib/templates'
import { supabase } from '@/lib/utils/supabase/client'
import { updateCode } from '@/lib/utils/supabase/queries'
import { useMutation } from '@tanstack/react-query'
import { experimental_useObject as useObject } from 'ai/react'
import { Button } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTemplateContext } from '../template'
import { SheetContent } from '@/components/ui/sheet'
import { useNotificationContext } from '@/lib/utils/notificationProvider'


export default function WebGeneratorLayout() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [isLoading, setIsLoading] = useState(false)

  const { result, setResult, backgroundColor } = useTemplateContext()
  const {openNotificationWithIcon}=useNotificationContext()
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
        openNotificationWithIcon('error','请求失败！', 'You have reached your request limit for the day.')
      } else {
        openNotificationWithIcon('error','请求失败！', 'An unexpected error has occurred.')
      }
      stop()
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error) {
        if (fragment) {
          setResult({ code: fragment.code })
          updateCode(supabase, chat_id, fragment.code, 'layout')
        }
      }
    },
  })

  useEffect(() => {
    setResult({ code: originalLayout(backgroundColor) })
  }, [backgroundColor])
  const { mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async () => {
      setIsLoading(true)
      if (result?.code) {
        const res = await updateCode(supabase, chat_id, result.code, 'detail')
        if (!res.success) {
          openNotificationWithIcon('error','代码更新失败',String(res.error))
          setIsLoading(false)
        }
      } else {
        openNotificationWithIcon('error','获取代码失败！请刷新重试')
      }
    },
    onSuccess: () => {
      setIsLoading(false)
      router.push(`${basePath}/detail`)
    },
    onError: () => {
      setIsLoading(false)
      openNotificationWithIcon('error','获取代码失败！请刷新重试')
    },
  })
  const onSubmit = (style: string, layout: string) => {
    const content: Message['content'] = [
      {
        type: 'text',
        text: layoutSubmitPrompt(backgroundColor, style, layout),
      },
    ]
    submit({
      messages: toAISDKMessages([
        {
          role: 'user',
          content,
        },
      ] as Message[]),
      step: 1,
    })
  }

  return (
    <div
      className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto"
    >
      <SheetContent side="left" className="w-[600px] sm:w-[740px] overflow-visible z-50">
        <div className="p-4">
          <StyleSelect isLoading={isSubmitLoading} onSubmit={onSubmit} />
        </div>
      </SheetContent>
      <div className="w-full p-2">
        <Button onClick={() => mutateAsync()} loading={isLoading}>
          下一步
        </Button>
      </div>


      <div className="flex-grow overflow-auto">
        <FragmentPreview result={result} />
      </div>
    </div>
  )
}
