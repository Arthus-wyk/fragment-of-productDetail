import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  MinusCircleTwoTone,
} from '@ant-design/icons'
import { Progress } from 'antd'
import { useState } from 'react'

export default function GenerateProgress({
  currentIndex = 0,
}: {
  currentIndex: number
}) {
  const nodes = [
    {
      name: '背景',
      valueIndex: 'background',
      index: 0,
    },
    {
      name: '布局',
      valueIndex: 'layout',
      index: 1,
    },
    {
      name: '商品信息',
      valueIndex: 'detail',
      index: 2,
    },
    {
      name: '扩展',
      valueIndex: 'expand',
      index: 3,
    },
    {
      name: '完成',
      valueIndex: 'finish',
      index: 4,
    },
  ]
  return (
    <div className="flex gap-3 justify-center items-center p-3">
      {nodes.map((node, index) => (
        <div key={index} className="flex items-center">
          {/* Icon 和文字部分 */}
          <div className="flex flex-col items-center w-5 mt-6">
            {/* Icon */}
            <div className="flex items-center justify-center">
              {index === currentIndex ? (
                <ClockCircleTwoTone />
              ) : index < currentIndex ? (
                <CheckCircleTwoTone />
              ) : (
                <MinusCircleTwoTone />
              )}
            </div>
            {/* 文字 */}
            <div className={` mt-1 text-center w-16 ${currentIndex==node.index ? 'font-bold text-bg':'text-sm'}  `}>{node.name}</div>
          </div>

          {/* 进度条部分 */}
          {index !== nodes.length - 1 && (
            <div className="flex items-center ml-4">
              {index < currentIndex ? (
                <Progress
                  className="w-32"
                  percent={100}
                  showInfo={false}
                  status="active"
                  strokeColor="#92CFFD"
                />
              ) : (
                <Progress
                  className="w-32"
                  percent={0}
                  showInfo={false}
                  status="active"
                  strokeColor="#92CFFD"
                  trailColor="#8B8B8B"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
