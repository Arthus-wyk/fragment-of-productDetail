// components/TemplateContext.tsx
'use client'

import GenerateInput from '@/components/generateInput'
import { backgroundPrompt } from '@/lib/create_prompt'
import { ExecutionResult } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { getColor } from '@/lib/utils/supabase/queries'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

// components/TemplateContext.tsx

type TemplateContextType = {
  isChatLoading: boolean
  result: ExecutionResult | undefined
  setIsChatLoading: (loading: boolean) => void
  setResult: (result: ExecutionResult | undefined) => void
  backgroundColor:string|undefined
  setBackgroundColor:(color:string)=>void
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined,
)

export const useTemplateContext = () => {
  const context = useContext(TemplateContext)
  if (!context) {
    throw new Error('必须在 Template 组件内使用 useTemplateContext')
  }
  return context
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() // 获取当前路径
  const router = useRouter() // 用于编程式导航

  const [isChatLoading, setIsChatLoading] = useState(false)
  const [result, setResult] = useState<ExecutionResult | undefined>()
  const [backgroundColor,setBackgroundColor]=useState('')
  const [progress,setProgress]=useState(0)

  if(!pathname){
    return null
  }
  // 定义路由与编号的映射关系
  const routeMap:{ [key: string]: number } = {
    'background': 0,
    'layout': 1,
    'dashboard': 2,
  };
  useEffect(()=>{
    const path=pathname.split('/').slice(-1)[0]
    if(path){
      setProgress(routeMap[path])
    }
    getColor(supabase,pathname.split('/').slice(-2)[0]).then((data)=>{
      if(data)
      setBackgroundColor(data[0].backgroundColor)
    })
  },[pathname])
  
  return (
    <TemplateContext.Provider
      value={{
        isChatLoading,
        result,
        setIsChatLoading,
        setResult,
        setBackgroundColor,
        backgroundColor
      }}
    >
      <main className="flex min-h-screen max-h-screen">
        <div className="grid w-full md:grid-cols-2">
          <GenerateInput
            result={result}
            setLoading={setIsChatLoading}
            setResult={setResult}
            progress={progress}
            backgroundColor={backgroundColor}
          
          />
          {children}
        </div>
      </main>
    </TemplateContext.Provider>
  )
}
