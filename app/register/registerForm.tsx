'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/pocketbase'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { LoaderCircle } from "lucide-react"

export const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/calendar'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@student.liu.se')) {
      setError('Använd din LiU mail')
      return
    }

    if (password !== confirmedPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    setIsLoading(true)
    try {
      const res = await signUp({
        name,
        email,
        password
      })
      if (res) {
        router.push(callbackUrl)
      } else {
        setIsLoading(false)
        setError('Invalid email or password')
      }
    } catch (err: Error | unknown) {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Fulla namn</Label>
        <Input
          placeholder='Place Holder'
          className="w-full"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          type="name"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">LiU mail</Label>
        <Input
          placeholder='abc123@student.liu.se'
          className="w-full"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Lösenord</Label>
        <div>
          <Input
            placeholder='Lösenord'
            className="w-full"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
          />
        </div>
        <Input
          placeholder='Bekräfta lösenord'
          className="w-full"
          required
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          id="confirmed-password"
          type="password"
        />
      </div>
      {error && <Alert variant={'destructive'}>{error}</Alert>}
      {/* Register button */}
      <div className="w-full">
        {!isLoading ? (
          <Button className="w-full" size="lg">
            Skapa konto
          </Button>
        ) : (
          <Button className="w-full" size="lg" disabled>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Skapar
          </Button>)
        }
      </div>
    </form>
  )
}