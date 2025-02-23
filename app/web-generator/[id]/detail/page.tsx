'use client'

import { useTemplateContext } from '../template'
import { FragmentPreview } from '@/components/fragment-preview'
import {
  fullScreenLayout,
  originalLayout,
  splitLayout,
  verticalLayout,
} from '@/lib/templates'
import { ExecutionResult } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { updateCode } from '@/lib/utils/supabase/queries'
import { UploadOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Divider, Form, Input, InputNumber, message, Space, Upload } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WebGeneratorDetail() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()
  
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const { isChatLoading, result, setResult, backgroundColor } =
    useTemplateContext()



  useEffect(()=>{
    setResult({ code: originalLayout(backgroundColor) })
  },[backgroundColor])
  const {mutate} = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn:async (name:string) => {
      if (result?.code){
        await updateCode(supabase,chat_id,result.code,'detail')
      }
    },
    onSuccess: (data) => {
      router.push(`${basePath}/detail`)
    },
    onError: (error) => {
      message.error("请求失败，请稍后重试")
    },
  

  })
  const handleNext = async() => {
      mutate
    }
  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto">
      <div className="w-full p-2">
        <Button onClick={handleNext}>下一步</Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>信息</h1>
      </Divider>
      
      <div className="flex-grow overflow-auto">
        <FragmentPreview result={result} />
      </div>
    </div>
  )
}
