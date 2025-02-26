import { SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'

export const getSession = cache(async (supabase: SupabaseClient) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    // 尝试使用刷新令牌获取新会话
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('刷新会话失败:', error)
      return null
    }
    console.log('Session data:', data)
    return data.session
  }

  return session
})

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.log('get user error:', error)
  }
  console.log('User:', user)
  return user
})

//用户的所有对话查询
export const getUserChatList = cache(
  async (supabase: SupabaseClient, user_id: string) => {
    let { data: chat, error } = await supabase
      .from('chat')
      .select('id,created_at,title,progress')
      .eq('user_id', user_id)
    if (error) {
      console.log('用户的所有对话查询失败！', error)
      return { success: false, chat }
    }
    return { success: true, chat }
  },
)

//对话内容的查询
export const getMessageList = cache(
  async (supabase: SupabaseClient, chat_id: string) => {
    let { data: message, error } = await supabase
      .from('message')
      .select('*')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: true }) // 按时间升序排列
    if (error) {
      console.log('对话内容的查询失败！', error)
      return { success: false, message }
    }
    return { success: true, message }
  },
)

//创建新对话
export const addNewChat = cache(
  async (
    supabase: SupabaseClient,
    user_id: string,
    title: string,
    progress: string,
  ) => {
    let { data: chat, error } = await supabase
      .from('chat')
      .insert([{ user_id, title, progress }])
      .select()
    if (error) {
      console.log('创建新对话失败！', error)
      return { success: false, chat }
    }
    return { success: true, chat }
  },
)

export const deleteChat = cache(
  async (
    supabase: SupabaseClient,
    chat_id:string
  ) => {
    let {error} = await supabase
      .from('chat')
      .delete()
      .eq('id', chat_id)
    if (error) {
      console.log('删除项目失败！', error)
      return { success: false, error }
    }
    return { success: true, error:null }
  },
)

//增加新的消息
export const addNewMessage = cache(
  async (
    supabase: SupabaseClient,
    chat_id: string,
    role: string,
    commentary: string,
    title: string,
    description: string,
    code: string,
  ) => {
    let { error } = await supabase
      .from('message')
      .insert([{ chat_id, role, commentary, title, description, code }])
    if (error) {
      console.log('增加新的消息失败！', error)
    }
  },
)

export const updateColor = cache(
  async (supabase: SupabaseClient, chat_id: string, color: string) => {
    let { error } = await supabase
      .from('chat')
      .update({ backgroundColor: color, progress: 'layout' })
      .eq('id', chat_id)
    if (error) {
      console.log('更新颜色失败', error)
      return { success: false, error } // 返回错误信息
    }
    return { success: true } // 返回成功标志
  },
)
export const updateCode = cache(
  async (
    supabase: SupabaseClient,
    chat_id: string,
    code: string,
    progress: string,
  ) => {
    let { error } = await supabase
      .from('chat')
      .update({ currentCode: code, progress })
      .eq('id', chat_id)

    if (error) {
      console.log('更新代码失败', error)
      return { success: false, error } // 返回错误信息
    }
    return { success: true } // 返回成功标志
  },
)

export const getColor = cache(
  async (supabase: SupabaseClient, chat_id: string) => {
    let { data: chat, error } = await supabase
      .from('chat')
      .select('backgroundColor')
      .eq('id', chat_id)
    if (error) {
      console.log('获取背景颜色失败！', error)
    }
    return chat
  },
)

export const getCode = cache(
  async (supabase: SupabaseClient, chat_id: string) => {
    let { data: chat, error } = await supabase
      .from('chat')
      .select('currentCode')
      .eq('id', chat_id)
    if (error) {
      console.log('获取代码失败！', error)
    }
    return chat
  },
)
