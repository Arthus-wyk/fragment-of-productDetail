import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowUp, Paperclip, Square, X } from 'lucide-react'
import { useMemo } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import UploadQiNiu from './uploadQiNiu'

export function ChatInput({
  retry,
  isErrored,
  isLoading,
  isRateLimited,
  stop,
  input,
  handleInputChange,
  handleSubmit,
  files,
  handleFileChange,
}: {
  retry: () => void
  isErrored: boolean
  isLoading: boolean
  isRateLimited: boolean
  stop: () => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  files: string[]
  handleFileChange: (files: string[]) => void

}) {




  function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (e.currentTarget.checkValidity()) {
        handleSubmit(e)
      } else {
        e.currentTarget.reportValidity()
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={onEnter}
      className="mb-2 flex flex-col mt-auto"
    >
      {isErrored && (
        <div
          className={`flex items-center p-1.5 text-sm font-medium mb-2 rounded-xl ${
            isRateLimited
              ? 'bg-orange-400/10 text-orange-400'
              : 'bg-red-400/10 text-red-400'
          }`}
        >
          <span className="flex-1 px-1.5">
            {isRateLimited
              ? 'You have reached your request limit for the day.'
              : 'An unexpected error has occurred.'}
          </span>
          <button
            className={`px-2 py-1 rounded-sm ${
              isRateLimited ? 'bg-orange-400/20' : 'bg-red-400/20'
            }`}
            onClick={retry}
          >
            Try again
          </button>
        </div>
      )}
      <div className="shadow-md rounded-2xl border">
        {/* <div className="flex items-center px-3 py-2 gap-1">{children}</div> */}
        <TextareaAutosize
          autoFocus={true}
          minRows={1}
          maxRows={5}
          className="text-normal p-3 resize-none ring-0 bg-inherit w-full m-0 outline-none "
          required={true}
          placeholder="Describe your app..."
          disabled={isErrored}
          value={input}
          onChange={handleInputChange}
        />
        <div className="flex p-3 gap-2 items-center">

          <div className="flex items-center flex-1 gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>


                </TooltipTrigger>
                <TooltipContent>Add attachments</TooltipContent>
              </Tooltip>
            </TooltipProvider>
             {/* {files.length > 0 && filePreview} */}
          </div>
          <div>
            {!isLoading ? (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isErrored}
                      variant="default"
                      size="icon"
                      type="submit"
                      className="rounded-xl h-10 w-10"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-xl h-10 w-10"
                      onClick={(e) => {
                        e.preventDefault()
                        stop()
                      }}
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Stop generation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
