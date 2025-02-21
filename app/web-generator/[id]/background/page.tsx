'use client'

import { useTemplateContext } from '../template'
import GradientBackgroundPicker from '@/components/gradientBackgroundPicker'
import { supabase } from '@/lib/utils/supabase/client'
import { updateColor } from '@/lib/utils/supabase/queries'
import { Button, Divider } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

export default function WebGeneratorBackground() {
  const router = useRouter() // 用于编程式导航
  const pathname = usePathname()
  const {
    isChatLoading,
    result,
    setBackgroundColor,
    backgroundColor,
    setResult,
  } = useTemplateContext()
  // 提取动态 ID
  const basePath = pathname?.split('/').slice(0, -1).join('/')! // 获取 `/web-generator/:id`
  const chat_id = basePath?.split('/').slice(-1)[0]
  const handleNext = () => {
    setResult(undefined)
    if (backgroundColor) updateColor(supabase, chat_id, backgroundColor)
    router.push(`${basePath}/layout`)
  }
  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full overflow-auto">
      <div className="w-full p-2">
        <Button onClick={handleNext}>下一步</Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>背景展示</h1>
      </Divider>
      <GradientBackgroundPicker
        isChatLoading={isChatLoading}
        result={result}
        setBackgroundColor={setBackgroundColor}
      />
    </div>
  )
}
