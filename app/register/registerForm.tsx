'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { LoaderCircle } from "lucide-react"
import { register } from '../actions/auth/register'

type Props = {
  confirmationCallback: () => void
}

export const RegisterForm = ({ confirmationCallback }: Props) => {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmedPassword = form.confirmedPassword.value;

    setError('');

    if (!email.includes('@student.liu.se')) {
      setError('Använd din LiU mail');
      return;
    }

    if (password !== confirmedPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    startTransition(() => {
      register({ name, email, password }).then((res) => {
        if (res.status === 'success') {
          confirmationCallback();
        } else {
          setError(res.message || 'Registreringen misslyckades');
        }
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Fulla namn</Label>
        <Input
          name="fullName"
          id="fullName"
          required
          autoComplete="name"
          autoCapitalize="words"
          inputMode="text"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Place Holder"
          className="w-full"
          type="text"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">LiU mail</Label>
        <Input
          name="email"
          id="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="abc123@student.liu.se"
          className="w-full"
          type="email"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          name="password"
          id="password"
          required
          placeholder="Lösenord"
          className="w-full"
          type="password"
        />
        <Input
          name="confirmedPassword"
          id="confirmedPassword"
          required
          placeholder="Bekräfta lösenord"
          className="w-full"
          type="password"
        />
      </div>

      {/* Register button and error message */}
      <div className="w-full">
        {error && <Alert variant="destructive" className="mb-3">{error}</Alert>}
        {!isPending ? (
          <Button className="w-full" size="lg">
            Skapa konto
          </Button>
        ) : (
          <Button className="w-full animate-pulse" size="lg" disabled>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Skapar konto
          </Button>
        )}
      </div>
    </form>
  )
}
