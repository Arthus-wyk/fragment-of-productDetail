// components/TemplateContext.tsx
'use client'

import GenerateInput from '@/components/generateInput'
import { backgroundPrompt } from '@/lib/create_prompt'
import { ExecutionResult } from '@/lib/types'
import { createContext, useContext, useState } from 'react'

// components/TemplateContext.tsx

type TemplateContextType = {
  isChatLoading: boolean
  result: ExecutionResult | undefined
  setIsChatLoading: (loading: boolean) => void
  setResult: (result: ExecutionResult | undefined) => void
  handleNextPart: () => void
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
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [result, setResult] = useState<ExecutionResult | undefined>()
  const handleNextPart = () => {}
  return (
    <TemplateContext.Provider
      value={{
        isChatLoading,
        result,
        setIsChatLoading,
        setResult,
        handleNextPart,
      }}
    >
      <main className="flex min-h-screen max-h-screen">
        <div className="grid w-full md:grid-cols-2">
          <GenerateInput
            r={backgroundPrompt}
            setLoading={setIsChatLoading}
            setResult={setResult}
            progress={0}
          />
          {children}
        </div>
      </main>
    </TemplateContext.Provider>
  )
}
