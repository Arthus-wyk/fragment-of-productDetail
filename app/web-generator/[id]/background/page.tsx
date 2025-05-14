'use client'

import GradientBackgroundPicker from '@/components/gradientBackgroundPicker'
import { supabase } from '@/lib/utils/supabase/client'
import { updateColor } from '@/lib/utils/supabase/queries'
import { useMutation } from '@tanstack/react-query'
import { Button, Divider, message } from 'antd'
import { error } from 'console'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTemplateContext } from '../template'

export default function WebGeneratorBackground() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()
  const { result, setBackgroundColor, backgroundColor } = useTemplateContext()
  // 提取动态 ID
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async () => {
      setIsLoading(true)
      console.log(backgroundColor)
      if (backgroundColor) {
        const res = await updateColor(supabase, chat_id, backgroundColor)
        if (!res.success) {
          message.error('颜色更新失败：' + res.error)
          setIsLoading(false)
        }
      } else {
        throw new Error('背景颜色未定义')
      }
    },
    onSuccess: () => {
      router.push(`${basePath}/layout`)
    },
    onError: () => {
      setIsLoading(false)
      message.error('请求失败，请稍后重试')
    },
  })

  return (
    <div
      className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full overflow-auto"
    >
      <div className="w-full p-2">
        <Button onClick={() => mutateAsync()} loading={isLoading}>
          下一步
        </Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>背景展示</h1>
      </Divider>
      <GradientBackgroundPicker
        result={result}
        setBackgroundColor={setBackgroundColor}
      />
    </div>
  )
}
