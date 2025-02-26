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
import { SmileOutlined, UploadOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { experimental_useObject as useObject } from 'ai/react'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Space,
  Upload,
} from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WebGeneratorDetail() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()

  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [isFinish, setIsFinish] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { result, setResult, backgroundColor } = useTemplateContext()

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
  const { mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async () => {
      setIsLoading(true)
      if (result?.code) {
        const res = await updateCode(supabase, chat_id, result.code, 'done')
        if (!res.success) {
          message.error('代码更新失败：' + res.error)
          setIsLoading(false)
        }
      } else {
        throw new Error('result为空')
      }
    },
    onSuccess: (data) => {
      setIsLoading(false)
      router.push(`/web-generator`)
    },
    onError: (error) => {
      setIsLoading(false)
      message.error('请求失败，请稍后重试')
    },
  })
  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto">
      <div className="w-full p-2">
        <Button onClick={() => setIsFinish(true)} loading={isLoading}>
          完成
        </Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>信息</h1>
      </Divider>
      <div className="flex-grow overflow-auto">
        <FragmentPreview result={result} />
      </div>
      <Modal open={isFinish} footer={null} width={'50%'} centered>
        <Result
          icon={<SmileOutlined />}
          title="非常棒！你已经完成全部步骤！"
          extra={[
            <Button onClick={() => setIsFinish(false)}>返回</Button>,
            <Button type="primary" onClick={() => mutateAsync()}>
              回到主页
            </Button>,
          ]}
        />
      </Modal>
    </div>
  )
}
