'use client'

import { type Message, useChat } from 'ai/react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { EmptyScreen } from '@/components/empty-screen'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { IS_PREVIEW } from '@/lib/constants'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [aiToken, setAiToken] = useLocalStorage<string | null>('ai-token', null)
  const [aiTokenDialog, setAiTokenDialog] = useState(IS_PREVIEW)
  const [aiTokenInput, setAiTokenInput] = useState(aiToken ?? '')
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        aiToken
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        } else if (response.status === 429) {
          // Error: 429 Rate limit reached for gpt-4-1106-preview on tokens per min. Limit: 80000 / min. Current: 1 / min.
          toast.error('You have reached your request limit for the day.')
        }
      }
    })
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={aiTokenDialog} onOpenChange={setAiTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview &
              production environments so that the open source community can test
              the app. The token will be saved to your browser&apos;s local
              storage under the name <code className="font-mono">ai-token</code>
              .
            </DialogDescription>
          </DialogHeader>
          <Input
            value={aiTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setAiTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setAiToken(aiTokenInput)
                setAiTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
