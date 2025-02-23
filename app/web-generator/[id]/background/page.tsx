'use client'

import WebGeneratorBackgroundPreview from './preview'
import SidebarLayout from '@/components/SidebarLayout'
import { FragmentPreview } from '@/components/fragment-preview'
import GenerateInput from '@/components/generateInput'
import GradientBackgroundPicker from '@/components/gradientBackgroundPicker'
import { originalLayout } from '@/lib/templates'
import { ExecutionResult } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { updateCode, updateColor } from '@/lib/utils/supabase/queries'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Layout, Menu, message } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content, Header } from 'antd/es/layout/layout'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter() // 用于编程式导航
  const { id } = useParams() as { id: string }
  const pathname = usePathname()
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [result, setResult] = useState<ExecutionResult | undefined>()
  const [backgroundColor, setBackgroundColor] = useState('')
  const [progress, setProgress] = useState(0)
  const {mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn:async () => {
      if (result?.code){
        await updateColor(supabase,id,result.code)
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
              <GradientBackgroundPicker
                isChatLoading={isChatLoading}
                result={result}
                setBackgroundColor={setBackgroundColor}
              />
            ),
            2: (
              <GenerateInput
                result={result}
                setLoading={setIsChatLoading}
                setResult={setResult}
                progress={progress}
                backgroundColor={backgroundColor}
                chat_id={id as string}
              />
            ),
          }}
        />
        <FragmentPreview result={{ code: originalLayout(backgroundColor) }} />
      </div>
    </div>
  )
}
