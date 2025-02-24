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
import { useMutation } from '@tanstack/react-query'
import { Button, Divider, message, Space } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WebGeneratorLayout() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [isLoading,setIsLoading]=useState(false)
  const { result, setResult, backgroundColor } =
    useTemplateContext()
  useEffect(()=>{
    setResult({ code: originalLayout(backgroundColor) })
  },[backgroundColor])
  const {mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn:async () => {
      setIsLoading(true)
      if (result?.code){
        const res =await updateCode(supabase,chat_id,result.code,'detail')
        if (!res.success) {
          message.error('代码更新失败：' + res.error)
          setIsLoading(false)
        }
      }
      else{
        throw new Error('result为空');
      }
    },
    onSuccess: () => {
      setIsLoading(false)
      router.push(`${basePath}/detail`)
    },
    onError: () => {
      setIsLoading(false)
      message.error("请求失败，请稍后重试")
    },
  })

  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto">
      <div className="w-full p-2">
        <Button onClick={()=>mutateAsync()} loading={isLoading}>下一步</Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>布局</h1>
      </Divider>
      <Space>
        {/* 渐变方向选择 */}
        <Button
          onClick={() => setResult({ code: originalLayout(backgroundColor) })}
        >
          经典布局
        </Button>
        <Button
          onClick={() => setResult({ code: splitLayout(backgroundColor) })}
        >
          分屏布局
        </Button>
        <Button
          onClick={() => setResult({ code: verticalLayout(backgroundColor) })}
        >
          垂直布局
        </Button>
        <Button
          onClick={() => setResult({ code: fullScreenLayout(backgroundColor) })}
        >
          全屏布局
        </Button>
      </Space>
      <div className="flex-grow overflow-auto">
        <FragmentPreview result={result} />
      </div>
    </div>
  )
}
