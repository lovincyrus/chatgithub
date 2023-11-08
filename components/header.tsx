import Link from 'next/link'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { IconGitHub, IconNextChat } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/" target="_blank" rel="nofollow">
          <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
          <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
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
