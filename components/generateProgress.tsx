import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  MinusCircleTwoTone,
} from '@ant-design/icons'
import { Progress, StepProps, Steps } from 'antd'
import { useEffect, useState } from 'react'

export default function GenerateProgress({
  currentIndex = 0,
}: {
  currentIndex: number
}) {
  const [index,setIndex]=useState(0)
  useEffect(()=>{
    setIndex(currentIndex)
  },[currentIndex])
  const items:StepProps[] = [
    {
      title: '背景',
    },
    {
      title: '布局',
    },
    {
      title: '详情',
    },
    {
      title: '扩展',
    },
    {
      title: '完成',
    },
  ]

  return <div className="flex gap-3 justify-center items-center p-3">
    <Steps items={items} current={index}/>
  </div>
}
