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

export function FragmentWeb({ result }: { result: ExecutionResultWeb |undefined}) {
  const [iframeKey, setIframeKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true); // 用于跟踪 iframe 的加载状态
  const encodedHTML = encodeURIComponent(result? result.code:'' );
  const dataURI = `data:text/html;charset=utf-8,${encodedHTML}`;

  const refreshIframe=() =>{
    setIframeKey((prevKey) => prevKey + 1)
  }
  useEffect(() => {
    refreshIframe();
  }, [result]);
  return (
    <div className="flex flex-col w-full h-full">
      {isLoading && (
        <Spin className="flex items-center justify-center w-full h-full">
          <div className="text-gray-500">加载中...</div>
        </Spin>
      )}
      <iframe
        key={iframeKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={dataURI}
        onLoad={() => setIsLoading(false)}
      />
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
  )
}
