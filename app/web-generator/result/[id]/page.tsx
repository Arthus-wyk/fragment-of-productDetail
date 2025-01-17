'use client'

import { AuthDialog } from '@/components/auth-dialog'
import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import { ChatPicker } from '@/components/chat-picker'
import { ChatSettings } from '@/components/chat-settings'
import { NavBar } from '@/components/navbar'
import { Preview } from '@/components/preview'
import { AuthViewType, useAuth } from '@/lib/auth'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { LLMModelConfig } from '@/lib/models'
import modelsList from '@/lib/models.json'
import { artifactSchema, FragmentSchema, fragmentSchema as schema } from '@/lib/schema'
import { supabase } from '@/lib/supabase'
import templates, { TemplateId } from '@/lib/templates'
import { ExecutionResult } from '@/lib/types'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { usePostHog } from 'posthog-js/react'
import { SetStateAction, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useRouter, useSearchParams } from 'next/navigation';
import { create_prompt } from '@/lib/create_prompt'

export default function Home() {
    const searchParams = useSearchParams();  // 获取查询参数
    const router = useRouter();
   

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
    const [ApiMessage,setApiMessages]= useState<Message[]>([])
    const [fragment, setFragment] = useState<DeepPartial<FragmentSchema>>()
    const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
    const [isPreviewLoading, setIsPreviewLoading] = useState(false)
    const [isAuthDialogOpen, setAuthDialog] = useState(false)
    const [authView, setAuthView] = useState<AuthViewType>('sign_in')
    const [isRateLimited, setIsRateLimited] = useState(false)
    const { session, apiKey } = useAuth(setAuthDialog, setAuthView)

    const currentModel = modelsList.models.find(
        (model) => model.id === languageModel.model,
    )
    const currentTemplate =
        selectedTemplate === 'auto'
            ? templates
            : { [selectedTemplate]: templates[selectedTemplate] }
    const lastMessage = messages[messages.length - 1]

    const { object, submit, isLoading, stop, error } = useObject({
        api:
            currentModel?.id === 'o1-preview' || currentModel?.id === 'o1-mini'
                ? '/api/chat-o1'
                : '/api/chat',
        schema:artifactSchema,
        onError: (error) => {
            if (error.message.includes('request limit')) {
                setIsRateLimited(true)
            }
        },
        onFinish: async ({ object: fragment, error }) => {
            if (!error) {
                // send it to /api/sandbox
                console.log('fragment', fragment)
                // setIsPreviewLoading(true)
                // posthog.capture('fragment_generated', {
                //     template: fragment?.template,
                // })

                // const response = await fetch('/api/sandbox', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         fragment,
                //         userID: session?.user?.id,
                //         apiKey,
                //     }),
                // })

                // const result = await response.json()
                // console.log('result', result)
                // posthog.capture('sandbox_created', { url: result.url })

                // setResult(result)
                // setCurrentPreview({ fragment, result })
                // setMessage({ result })
                // setCurrentTab('fragment')
                // setIsPreviewLoading(false)
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

    useEffect(()=>{
        const prompt=create_prompt(byAI,name,price,pic,desc,spec,content,style,layout,interactive)
        const contents: Message['content'] = [{ type: 'text', text: prompt }]
        const updatedMessages:Message={
            role: "user",
            content:contents,
        }
        setApiMessages((previousMessages) => [...previousMessages, updatedMessages])
        submit({
            userID: session?.user?.id,
            messages: toAISDKMessages([updatedMessages]),
            template: currentTemplate,
            model: currentModel,
            config: languageModel,
        })
    },[])
    useEffect(() => {
        if (error) stop()
    }, [error])
    if(!searchParams){
        router.push('/web-generator'); 
        return null
    }
   
    // 将查询参数转换为所需的数据格式
    const byAI=searchParams.get('byAI')|| '1';
    const name=searchParams.get('name') || '';
    const price=searchParams.get('price') || '';
    const desc=searchParams.get('desc') || '';
    const spec=searchParams.get('spec') || '';
    const pic=searchParams.get('pic')|| '';
    const content = searchParams.get('content')?.split(',') || [];
    const style = searchParams.get('style') || '';
    const layout = searchParams.get('layout') || '';
    const interactive = searchParams.get('interactive')?.split(',') || [];

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

    function handleLanguageModelChange(e: LLMModelConfig) {
        setLanguageModel({ ...languageModel, ...e })
        console.log(languageModel)
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

    function handleClearChat() {
        stop()
        setChatInput('')
        setFiles([])
        setMessages([])
        setApiMessages([])
        setFragment(undefined)
        setResult(undefined)
        setCurrentTab('code')
        setIsPreviewLoading(false)
    }

    function setCurrentPreview(preview: {
        fragment: DeepPartial<FragmentSchema> | undefined
        result: ExecutionResult | undefined
    }) {
        setFragment(preview.fragment)
        setResult(preview.result)
    }

    function handleUndo() {
        setMessages((previousMessages) => [...previousMessages.slice(0, -2)])
        setApiMessages((previousMessages) => [...previousMessages.slice(0, -2)])
        setCurrentPreview({ fragment: undefined, result: undefined })
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
                        onClear={handleClearChat}
                        canClear={messages.length > 0}
                        canUndo={messages.length > 1 && !isLoading}
                        onUndo={handleUndo}
                    />
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

                </div>
                <Preview
                    apiKey={apiKey}
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