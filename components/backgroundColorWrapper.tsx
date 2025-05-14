/**
 * Wrapper used to change background color of the HTML, based on which page the user is on.
 * This is to prevent the default background from showing when, ex. scrolling too far up on the page
 */
'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function BackgroundColorWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const html = document.documentElement
    html.style.backgroundColor = pathname === '/' ? '#cfb298' : '#18181b'

    // Optional: reset on unmount
    return () => {
      html.style.backgroundColor = ''
    }
  }, [pathname])

  return <>{children}</>
}
