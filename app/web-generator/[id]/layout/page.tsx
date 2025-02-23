'use client'


import SidebarLayout from '@/components/SidebarLayout'
import { FragmentPreview } from '@/components/fragment-preview'
import GenerateInput from '@/components/generateInput'
import LayoutPicker from '@/components/layoutPicker'
import {
  fullScreenLayout,
  originalLayout,
  splitLayout,
  verticalLayout,
} from '@/lib/templates'
import { ExecutionResult } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { updateCode } from '@/lib/utils/supabase/queries'
import { useMutation } from '@tanstack/react-query'
import { Button, Divider, message, Space } from 'antd'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WebGeneratorLayout() {
  const router = useRouter() // 用于编程式导航
  const { id } = useParams() as { id: string }
  const pathname = usePathname()
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [result, setResult] = useState<ExecutionResult | undefined>()
  const [backgroundColor, setBackgroundColor] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

  useEffect(()=>{
    setResult({ code: originalLayout(backgroundColor) })
  },[backgroundColor])
  const {mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn:async () => {
      if (result?.code){
        await updateCode(supabase,chat_id,result.code,'detail')
      }
    },
    onSuccess: () => {
      router.push(`${basePath}/detail`)
    },
    onError: () => {
      message.error("请求失败，请稍后重试")
    },

  })

  return (
    <div className="flex min-h-screen max-h-screen">
    <div className="grid w-full md:grid-cols-2">
      <SidebarLayout
        defaultContentKey="1" // 默认显示内容 1
        header={
          <div className="w-full p-2">
            <Button onClick={()=>mutateAsync()}>下一步</Button>
          </div>
        }
        contentMap={{
          1: (
            <LayoutPicker
              setResult={setResult}
              backgroundColor={backgroundColor}
            />
          ),
          2: (
            <GenerateInput
              result={result}
              setLoading={setIsChatLoading}
              setResult={setResult}
              progress={1}
              backgroundColor={backgroundColor}
              chat_id={id as string}
            />
          ),
        }}
      />
      <FragmentPreview result={result} />
    </div>
  </div>
  )
}
