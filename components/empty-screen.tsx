import { UseChatHelpers } from 'ai/react'

import { ExternalLink } from '@/components/external-link'
import { Button } from '@/components/ui/button'

const exampleMessages = [
  `Retrieve the content of the 'README.md' file from the 'octocat/Hello-World' repository on GitHub.`,
  `List the comments on issue #42 in the 'octocat/Hello-World' repository.`,
  `Find all open issues in the 'nodejs/node' repository on GitHub.`,
  `Show me the comments on pull request #123 in the 'facebook/react' repository.`,
  `Get a summary of the comments on the latest pull request in the 'angular/angular' repository.`,
  `Summarize the top issues found in emilkowalski/vaul.`
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to ChatGitHub!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source AI chatbot app template built with{' '}
          <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and{' '}
          <ExternalLink href="https://vercel.com/storage/kv">
            Vercel KV
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message)}
            >
              <p className="text-left">{message}</p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
