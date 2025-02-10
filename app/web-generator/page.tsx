'use client'

import { AuthDialog } from '@/components/auth-dialog'
import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import { Preview } from '@/components/preview'
import { AuthViewType, useAuth } from '@/lib/auth'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { LLMModelConfig } from '@/lib/models'
import modelsList from '@/lib/models.json'
import { artifactSchema, ArtifactSchema } from '@/lib/schema'
import templates, { TemplateId } from '@/lib/templates'
import { ExecutionResult, questionQuery } from '@/lib/types'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { create_prompt } from '@/lib/create_prompt'
import { NavBar } from '@/components/navbar'
import { supabase } from '@/lib/utils/supabase/client'
import Form from '@/components/form'
import { addNewChat, addNewMessage, getMessageList } from '@/lib/utils/supabase/queries'

export default function WebGenerator({
    params
}: {
    params: { id: string };
}) {



    const [chatInput, setChatInput] = useLocalStorage('chat', '')
    const [files, setFiles] = useState<string[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
        'auto',
    )
    const [languageModel, setLanguageModel] = useLocalStorage<LLMModelConfig>(
        'languageModel',
        {
            model: 'claude-3-5-sonnet-latest',
        },
    )

    const posthog = usePostHog()
    const [result, setResult] = useState<ExecutionResult>()
    const [messages, setMessages] = useState<Message[]>([])
    const [ApiMessage, setApiMessages] = useState<Message[]>([])
    const [fragment, setFragment] = useState<DeepPartial<ArtifactSchema>>()
    const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
    const [isPreviewLoading, setIsPreviewLoading] = useState(false)
    const [isAuthDialogOpen, setAuthDialog] = useState(false)
    const [authView, setAuthView] = useState<AuthViewType>('sign_in')
    const [isRateLimited, setIsRateLimited] = useState(false)
    const { session, apiKey } = useAuth(setAuthDialog, setAuthView)
    let chat_id = ''
    const currentModel = modelsList.models.find(
        (model) => model.id === languageModel.model,
    )
    const currentTemplate =
        selectedTemplate === 'auto'
            ? templates
            : { [selectedTemplate]: templates[selectedTemplate] }
    const lastMessage = messages[messages.length - 1]

    const { object, submit, isLoading, stop, error } = useObject({
        api: '/api/chat',
        schema: artifactSchema,
        onError: (error) => {
            if (error.message.includes('request limit')) {
                setIsRateLimited(true)
            }
        },
        onFinish: async ({ object: fragment, error }) => {
            if (!error) {
                console.log('fragment', fragment)

                if (fragment)
                    setResult({ code: fragment.code })

            }
        },
    })

    useEffect(() => {
        if (object) {
            setFragment(object)
            const content: Message['content'] = [
                { type: 'text', text: object.commentary || '' },
                { type: 'code', text: object.code || '' },
            ]

            if (!lastMessage || lastMessage.role !== 'assistant') {
                addMessage({
                    role: 'assistant',
                    content,
                    object,
                })
            }

            if (lastMessage && lastMessage.role === 'assistant') {
                setMessage({
                    content,
                    object,
                })
            }

        }
    }, [object])

    useEffect(() => {
        if (object?.title) {
            if (chat_id == '') {
                if (session) {
                    addNewChat(supabase, session?.user?.id, object.title)
                        .then((newChat) => {
                            if (newChat) {
                                chat_id = newChat[0].id
                                // 请求处理完后更新URL，但不刷新页面
                                const newUrl = `/web-generator/${newChat[0].id}`; // 新的 URL
                                window.history.pushState(null, '', newUrl)
                                if (ApiMessage[0].content[0].type == 'text')
                                    addNewMessage(supabase, newChat[0].id, 'user', ApiMessage[0].content[0].text, '', '', '')
                                addNewMessage(supabase, newChat[0].id, 'assistant', object.commentary || '', object.title || '', object.description || '', object.code || '')
                            }
                        })
                }
            }
            else {
                addNewMessage(supabase, chat_id, 'assistant', object.commentary || '', object.title || '', object.description || '', object.code || '')
            }
        }
    }, [object])

    useEffect(() => {
        if (error) stop()
    }, [error])


    function setMessage(message: Partial<Message>, index?: number) {
        setMessages((previousMessages) => {
            const updatedMessages = [...previousMessages]
            updatedMessages[index ?? previousMessages.length - 1] = {
                ...previousMessages[index ?? previousMessages.length - 1],
                ...message,
            }

            return updatedMessages
        })
        setApiMessages((previousMessages) => {
            const updatedMessages = [...previousMessages]
            updatedMessages[index ?? previousMessages.length - 1] = {
                ...previousMessages[index ?? previousMessages.length - 1],
                ...message,
            }

            return updatedMessages
        })
    }

    async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!session) {
            return setAuthDialog(true)
        }

        if (isLoading) {
            stop()
        }

        const content: Message['content'] = [{ type: 'text', text: chatInput }]
        const images = files

        if (images.length > 0) {
            images.forEach((image) => {
                content.push({ type: 'image', image })
            })
        }

        const updatedMessages = addMessage({
            role: "user",
            content,
        })

        submit({
            userID: session?.user?.id,
            messages: toAISDKMessages(updatedMessages),
            template: currentTemplate,
            model: currentModel,
            config: languageModel,
        })
        addNewMessage(supabase, chat_id, 'user',chatInput, '',  '',  '')

        setChatInput('')
        setFiles([])
        setCurrentTab('code')

        posthog.capture('chat_submit', {
            template: selectedTemplate,
            model: languageModel.model,
        })
    }

    function retry() {
        submit({
            userID: session?.user?.id,
            messages: toAISDKMessages(ApiMessage),
            template: currentTemplate,
            model: currentModel,
            config: languageModel,
        })
    }

    function addMessage(message: Message) {
        setMessages((previousMessages) => [...previousMessages, message])
        setApiMessages((previousMessages) => [...previousMessages, message])
        return [...ApiMessage, message]
    }

    function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setChatInput(e.target.value)
    }

    function handleFileChange(change: string[]) {
        console.log("当前图片:", change)
        setFiles(change)
    }

    function logout() {
        supabase
            ? supabase.auth.signOut()
            : console.warn('Supabase is not initialized')
    }


    function handleSocialClick(target: 'github' | 'x' | 'discord') {
        if (target === 'github') {
            window.open('https://github.com/e2b-dev/fragments', '_blank')
        } else if (target === 'x') {
            window.open('https://x.com/e2b_dev', '_blank')
        } else if (target === 'discord') {
            window.open('https://discord.gg/U7KEcGErtQ', '_blank')
        }

        posthog.capture(`${target}_click`)
    }


    function setCurrentPreview(preview: {
        fragment: DeepPartial<ArtifactSchema> | undefined
        result: ExecutionResult | undefined
    }) {
        setFragment(preview.fragment)
        setResult(preview.result)
    }


    function GoToAccount() {
        console.log('1')
        window.open('/account', '_blank')
    }
    function setFirstMessage(queryParams: questionQuery) {
        if (!session) {
            return setAuthDialog(true)
        }
        const prompt = create_prompt(queryParams)
        const contents: Message['content'] = [{ type: 'text', text: prompt }]
        const updatedMessages: Message = {
            role: "user",
            content: contents,
        }
        setApiMessages((previousMessages) => [...previousMessages, updatedMessages])
        submit({
            userID: session?.user?.id,
            messages: toAISDKMessages([updatedMessages]),
            template: currentTemplate,
            model: currentModel,
            config: languageModel,
        })



    }

    return (
        <main className="flex min-h-screen max-h-screen">
            {supabase && (
                <AuthDialog
                    open={isAuthDialogOpen}
                    setOpen={setAuthDialog}
                    view={authView}
                    supabase={supabase}
                />
            )}
            <div className="grid w-full md:grid-cols-2">
                <div
                    className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto ${fragment ? 'col-span-1' : 'col-span-2'}`}
                >
                    <NavBar
                        session={session}
                        showLogin={() => setAuthDialog(true)}
                        signOut={logout}
                        onSocialClick={handleSocialClick}
                        onGoToAccount={GoToAccount}
                    />
                    {ApiMessage.length > 0 ? (
                        <>
                            <Chat
                                messages={messages}
                                isLoading={isLoading}
                                setCurrentPreview={setCurrentPreview}
                            />
                            <ChatInput
                                retry={retry}
                                isErrored={error !== undefined}
                                isLoading={isLoading}
                                isRateLimited={isRateLimited}
                                stop={stop}
                                input={chatInput}
                                handleInputChange={handleSaveInputChange}
                                handleSubmit={handleSubmitAuth}
                                isMultiModal={currentModel?.multiModal || false}
                                files={files}
                                handleFileChange={handleFileChange}
                            />
                        </>) : (
                        <Form setFirstMessage={setFirstMessage} />
                    )}



                </div>
                <Preview
                    // apiKey={apiKey}
                    selectedTab={currentTab}
                    onSelectedTabChange={setCurrentTab}
                    isChatLoading={isLoading}
                    isPreviewLoading={isPreviewLoading}
                    fragment={fragment}
                    result={result as ExecutionResult}
                    onClose={() => setFragment(undefined)}
                />
            </div>
        </main>
    )
}