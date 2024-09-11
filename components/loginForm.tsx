'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/pocketbase'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/calendar'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("Logging in user: ", { username, password });
      const loginWasSuccess = await login({
        username,
        password
      })
      console.log(loginWasSuccess)
      if (loginWasSuccess) {
        router.push(callbackUrl)
      } else {
        setError('Invalid email or password')
      }
    } catch (err: Error | unknown) { }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Liu id</Label>
        <Input
          className="w-full"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          type="username"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          className="w-full"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="w-full">
        <Button className="w-full" size="lg">
          Logga in
        </Button>
      </div>
    </form>
  )
}