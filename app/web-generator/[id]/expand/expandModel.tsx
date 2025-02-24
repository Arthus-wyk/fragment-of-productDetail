'use client'

import { Card } from 'antd'

export default function ExpandModel({
  onEditModule,
}: {
  onEditModule: (id: number) => void
}) {
  // 渲染模块内容
  const preDefinedModules = [
    {
      id: 1,
      title: '用户评价',
      content: '用于展示用户评价、评分、评论内容等。',
    },
    {
      id: 2,
      title: '商家信息',
      content: '展示商家名称、信用等级、发货地等信息。',
    },
    { id: 3, title: '推荐商品', content: '展示相关商品或推荐商品的列表。' },
    { id: 4, title: '售后服务', content: '展示退换货政策、保修服务等信息。' },
    { id: 5, title: '问答', content: '展示客户的提问和商家的解答' },
  ]
  const renderModuleContent = (module: { title: any; content: any }) => {
    return (
      <div className="flex flex-col items-start justify-center h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {module.title}
        </h3>
        <p className="text-sm text-gray-600">{module.content}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {preDefinedModules.map((module) => (
        <div
          key={module.id}
          onDoubleClick={() => onEditModule(module.id)} // 双击触发编辑
          className="w-80 h-52 bg-white shadow-lg rounded-lg cursor-pointer p-5 transform transition-transform hover:scale-105 hover:shadow-xl"
        >
          {renderModuleContent(module)}
        </div>
      ))}
    </div>
  )
}
