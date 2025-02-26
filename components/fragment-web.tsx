'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ExecutionResultWeb } from '@/lib/types'
import { Spin } from 'antd'
import { RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'

export function FragmentWeb({
  result,
}: {
  result: ExecutionResultWeb | undefined
}) {
  const [iframeKey, setIframeKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true) // 用于跟踪 iframe 的加载状态
  const encodedHTML = encodeURIComponent(result ? result.code : '')
  const dataURI = `data:text/html;charset=utf-8,${encodedHTML}`

  const refreshIframe = () => {
    setIframeKey((prevKey) => prevKey + 1)
  }
  useEffect(() => {
    refreshIframe()
  }, [result])
  return (
    <div className="flex flex-col w-full h-full">
      {/* 关键修改 1：为 Spin 添加高度和 flex 容器 */}
      <Spin spinning={isLoading}
        className="h-full [&_.ant-spin-container]:!h-full"
        wrapperClassName="flex flex-col h-full"
      >
        {/* 关键修改 2：用 flex-1 控制 iframe 高度 */}
        <div className="relative h-full">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1">
              <iframe
                key={iframeKey}
                className="h-full w-full"
                sandbox="allow-forms allow-scripts allow-same-origin"
                loading="lazy"
                src={dataURI}
                onLoad={() => setIsLoading(false)}
              />
            </div>

            {/* 底部按钮区域 */}
            <div className="p-2 border-t">
              <div className="flex items-center bg-muted dark:bg-white/10 rounded-2xl">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="link"
                        className="text-muted-foreground"
                        onClick={refreshIframe}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}
