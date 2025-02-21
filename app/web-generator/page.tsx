'use client'
import { AuthViewType, useAuth } from '@/lib/auth'
import { supabase } from '@/lib/utils/supabase/client'
import { getUserChatList } from '@/lib/utils/supabase/queries'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Card } from 'antd'
import Link from 'next/link'
import { useState } from 'react'

export default function WebGenerator() {
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const { session } = useAuth(setAuthDialog, setAuthView)
  const {
    refetch,
    data,
    isLoading: isLoadingChatList,
  } = useQuery({
    queryKey: ['getChatList'],
    queryFn: async () => {
      if (session) {
        const list = await getUserChatList(supabase, session.user.id)
        return list
      }
      return []
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">项目仪表盘</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              新增项目
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">所有项目</h2>
        </div>

        {/* 项目网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 新增项目卡片 */}
          <Button className="h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center">
            <span className="text-gray-500 hover:text-gray-700">
              + 新建项目
            </span>
          </Button>

          {/* 已有项目卡片 */}
          {data && data.map((project) => (
            <Card
              key={project.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>创建时间</span>
                <time>
                  {new Date(project.created_at).toLocaleDateString('zh-CN')}
                </time>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
