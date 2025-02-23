import {
  fullScreenLayout,
  originalLayout,
  splitLayout,
  verticalLayout,
} from '@/lib/templates'
import { Button, Divider, Space } from 'antd'

export default function LayoutPicker({
  setResult,
  backgroundColor,
}: {
  setResult:any
  backgroundColor: string | undefined
}) {
  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y  h-full w-full flex flex-col overflow-auto">
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
    </div>
  )
}
