'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Lock } from "lucide-react"
import { login } from '../actions/auth/login'

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/calendar';

  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;

    startTransition(() => {
      login({ username, password }).then((res) => {
        if (res.status === 'success') {
          router.push(callbackUrl);
        } else {
          setError(res.message);
        }
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Liu id</Label>
        <Input
          name='username'
          autoComplete="username"
          className="w-full"
          required
          id="username"
          type="text"
          inputMode="email"
          autoCapitalize="none"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          name='password'
          className="w-full"
          required
          id="password"
          type="password"
        />
      </div>

      {/* Login button */}
      <div className="w-full">
        {error && <Alert variant={"destructive"} className='mb-3'>{error}</Alert>}
        {!isPending ? (
          <Button className="w-full" size="lg">
            Logga in
          </Button>
        ) : (
          <Button className="w-full animate-pulse" size="lg" disabled>
            <Lock className="mr-2 h-4 w-4" />
            Loggar in
          </Button>)
        }
      </div>
    </form>
  )
}