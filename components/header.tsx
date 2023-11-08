import Link from 'next/link'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { IconGitHub } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/" target="_blank" rel="nofollow">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-lg font-semibold">ChatGitHub</h1>
            <p className="inline-flex items-center rounded border border-neutral-200 bg-neutral-50 p-1 font-mono text-sm leading-4 text-neutral-900 no-underline dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
              gpt-4-1106-preview
            </p>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-end">
        <a
          target="_blank"
          href="https://github.com/lovincyrus/chatgithub"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="ml-2 hidden md:flex">GitHub</span>
        </a>
      </div>
    </header>
  )
}
