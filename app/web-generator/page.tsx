'use client'

import { AuthDialog } from '@/components/auth-dialog'
import { AuthViewType, useAuth } from '@/lib/auth'
import { supabase } from '@/lib/utils/supabase/client'
import {
  addNewChat,
  deleteChat,
  getUserChatList,
} from '@/lib/utils/supabase/queries'
import DeleteTwoTone from '@ant-design/icons/lib/icons/DeleteTwoTone'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Spin,
  message,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WebGenerator() {
  const [form] = Form.useForm()
  const router = useRouter() // 用于编程式导航
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const { session } = useAuth(setAuthDialog, setAuthView)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isComfirm, setIscomfirm] = useState(false)
  const {
    refetch,
    data,
    isLoading: isLoadingChatList,
  } = useQuery({
    queryKey: ['getChatList'],
    queryFn: async () => {
      const res = await getUserChatList(supabase, session?.user.id!)
      if (res.success) {
        setIsLoading(false)
        return res.chat
      } else {
        message.error('获取对话列表失败')
        return []
      }
    },
    enabled: !!session,
  })

  const { mutate } = useMutation({
    mutationKey: ['addNewChat'],
    mutationFn: async (name: string) => {
      const res = await addNewChat(
        supabase,
        session?.user.id!,
        name,
        'background',
      )
      if (res.success) {
        return res.chat
      } else {
        throw new Error('新增项目失败')
      }
    },
    onSuccess: (data) => {
      if (data) {
        router.push(`web-generator/${data[0].id}/background`)
      } else {
        setIscomfirm(false)
        message.error('创建新项目失败')
      }
    },
    onError: (error) => {
      message.error('创建新项目失败')
      setIscomfirm(false)
    },
  })
  const openChat = (id: string, progress: string) => {
    if(progress=='done'){
      router.push(`web-generator/${id}/finish`)
    }else{
      router.push(`web-generator/${id}/${progress}`)
    }
      
    
  }
  const handleNewChat = () => {
    if (!session) {
      setAuthDialog(true)
    } else {
      setIsModalOpen(true)
    }
  }
  const handleOk = () => {
    const name = form.getFieldValue('name')
    setIscomfirm(true)
    mutate(name)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setIscomfirm(false)
  }
  const handleDeleteChat = async (event: any, chat_id: string) => {
    event.stopPropagation()
    const res = await deleteChat(supabase, chat_id)
    if (res.success) {
      message.success('删除项目成功')
      refetch()
    } else {
      message.error('删除项目失败，请稍后再试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Spin spinning={isComfirm}>
        {supabase && (
          <AuthDialog
            open={isAuthDialogOpen}
            setOpen={setAuthDialog}
            view={authView}
            supabase={supabase}
          />
        )}
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
            {isLoadingChatList || isLoading ? (
              // 显示骨架屏
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  active
                  className="h-48 w-full rounded-xl p-6"
                  style={{ width: '100%' }}
                />
              ))
            ) : (
              <>
                {/* 新增项目卡片 */}
                <Button
                  className="h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center"
                  onClick={() => handleNewChat()}
                >
                  <span className="text-gray-500 hover:text-gray-700">
                    + 新建项目
                  </span>
                </Button>

                {/* 已有项目卡片 */}
                {data &&
                  data.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-white h-48 rounded-xl shadow-sm hover:shadow-md transition-shadow p-2"
                      onClick={() => openChat(project.id, project.progress)}
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>创建时间</span>
                        <time>
                          {new Date(project.created_at).toLocaleDateString(
                            'zh-CN',
                          )}
                        </time>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Popconfirm
                          title="确定删除该会员类型"
                          onConfirm={(event) =>
                            handleDeleteChat(event, project.id)
                          }
                        >
                          <Button
                            size="large"
                            color="default"
                            variant="text"
                            onClick={(event) => event.stopPropagation()} // 阻止 Popconfirm 的触发器冒泡
                            icon={
                              <DeleteTwoTone
                                style={{ fontSize: '25px' }}
                                twoToneColor="#FF0000"
                              />
                            }
                          />
                        </Popconfirm>
                      </div>
                    </Card>
                  ))}
              </>
            )}
          </div>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={
              <div>
                <Button type="default" onClick={handleCancel}>
                  取消
                </Button>
                <Button onClick={handleOk} loading={isComfirm} type="primary">
                  确定
                </Button>
              </div>
            }
          >
            <Form form={form}>
              <FormItem label="name" name="name" required>
                <Input />
              </FormItem>
            </Form>
          </Modal>
        </main>
      </Spin>
    </div>
  )
}
