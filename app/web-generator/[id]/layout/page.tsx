'use client'
import { FragmentPreview } from '@/components/fragment-preview'
import { useTemplateContext } from '../template'
import { ExecutionResult } from '@/lib/types'
import { Button, Divider } from 'antd'

export default function WebGeneratorLayout() {
  const { isChatLoading, result } = useTemplateContext()

  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full overflow-auto">
      <div className='w-full p-2'>
        <Button>下一步</Button>
      </div>
      <Divider style={{ borderColor: '#ffffff' }}>
        <h1 style={{ color: 'white', margin: 0 }}>布局</h1>
      </Divider>
      <FragmentPreview result={result} />
    </div>
  )
}
