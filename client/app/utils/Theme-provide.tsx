'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"         // ensures `dark` class goes on <html>
      defaultTheme="system"     // respects system preference on first load
      enableSystem={true}       // allow system theme switching
      disableTransitionOnChange // avoids flash of transitions when toggling
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
