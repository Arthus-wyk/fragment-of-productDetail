// components/TemplateContext.tsx
'use client'

import GenerateInput from '@/components/generateInput'
import { backgroundPrompt } from '@/lib/create_prompt'
import { ExecutionResult } from '@/lib/types'
import { supabase } from '@/lib/utils/supabase/client'
import { getColor } from '@/lib/utils/supabase/queries'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// components/TemplateContext.tsx

// components/TemplateContext.tsx

type TemplateContextType = {
  result: ExecutionResult | undefined
  setResult: (result: ExecutionResult | undefined) => void
  backgroundColor: string | undefined
  setBackgroundColor: (color: string) => void
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
  const pathname = usePathname(); // 获取当前路径
  const router = useRouter(); // 用于编程式导航

  const [result, setResult] = useState<ExecutionResult | undefined>();
  const [backgroundColor, setBackgroundColor] = useState('');
  const [progress, setProgress] = useState(0);

  const chatId = useMemo(() => {
    if (!pathname) return null;
    return pathname.split('/').slice(-2)[0];
  }, [pathname]);

  // 定义路由与编号的映射关系
  const routeMap: { [key: string]: number } = {
    background: 0,
    layout: 1,
    detail: 2,
    expand: 3,
    finish: 4,
  };

  useEffect(() => {
    if (!pathname || !chatId) return;

    const path = pathname.split('/').slice(-1)[0];

    // 设置进度
    if (path) {
      setProgress(routeMap[path]);
    }

    // 如果不是背景页，获取背景颜色
    if (routeMap[path] !== 0) {
      getColor(supabase, chatId).then((data) => {
        if (data) {
          setBackgroundColor(data[0].backgroundColor);
          console.log(data[0].backgroundColor);
        }
      });
    }
  }, [pathname, chatId]);

  // 如果 pathname 不存在，渲染一个占位内容
  if (!pathname) {
    return <div>Loading...</div>;
  }

  return (
    <TemplateContext.Provider
      value={{
        result,
        setResult,
        setBackgroundColor,
        backgroundColor,
      }}
    >
      <main className="flex min-h-screen max-h-screen">
        <div className="grid w-full md:grid-cols-2">
          <GenerateInput
            result={result}
            setResult={setResult}
            progress={progress}
            chat_id={chatId || ''}
          />
          {children}
        </div>
      </main>
    </TemplateContext.Provider>
  );
}
