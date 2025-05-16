"use client"
import { notification } from 'antd'
import React from 'react'


type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationContextProps {
  openNotificationWithIcon: (
    type: NotificationType,
    message?: string,
    description?: string
  ) => void;
}

const NotificationContext = React.createContext<NotificationContextProps | undefined>(undefined)

export  default function NotificationProvider({children}:{children: React.ReactNode}) {
  const [api, contextHolder] = notification.useNotification()

  const openNotificationWithIcon = (type: NotificationType, message?: string, description?: string) => {
    api[type]({
      message,
      description,
      showProgress: true,
      pauseOnHover:true,
      duration: 2,
    })
  }
  return(
    <NotificationContext.Provider value={{openNotificationWithIcon}}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}
export const useNotificationContext = () => {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
