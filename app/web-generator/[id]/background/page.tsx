'use client'

import GradientBackgroundPicker, { gradientStyleType } from '@/components/gradientBackgroundPicker'
import { supabase } from '@/lib/utils/supabase/client'
import { updateColor } from '@/lib/utils/supabase/queries'
import { useMutation } from '@tanstack/react-query'
import { Button, Divider, message } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTemplateContext } from '../template'
import { SheetContent } from '@/components/ui/sheet'
import BgPreview from '@/components/ui/bgPreview'
import { defaultStyle } from '@/app/web-generator/[id]/background/defaultStyle'

export default function WebGeneratorBackground() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()
  const { result } = useTemplateContext()
  // 提取动态 ID
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const [isLoading, setIsLoading] = useState(false)
  const [Bgcolor, setBgcolor] = useState<gradientStyleType | null>(null)
  const { mutateAsync } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async () => {
      setIsLoading(true)

      const res = await updateColor(supabase, chat_id, Bgcolor ? Bgcolor.background : defaultStyle.background)
      if (!res.success) {
        message.error('颜色更新失败：' + res.error)
        setIsLoading(false)
      }
    },
    onSuccess: () => {
      router.push(`${basePath}/layout`)
    },
    onError: () => {
      setIsLoading(false)
      message.error('请求失败，请稍后重试')
    }
  })

  return (
    <div
      className="absolute md:relative left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  w-full overflow-auto"
    >
      <SheetContent side="left" className="w-[600px] sm:w-[740px] overflow-visible z-50">
        <div className="p-4">
          <GradientBackgroundPicker
            result={result}
            onBgChange={setBgcolor}
          />
        </div>
      </SheetContent>
      <div className="w-full p-2">
        <Button onClick={() => mutateAsync()} loading={isLoading}>
          下一步
        </Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
      </Divider>

      <BgPreview gradientStyle={Bgcolor} />
    </div>
  )
}
