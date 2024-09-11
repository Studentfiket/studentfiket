import Link from 'next/link'
import { LoginForm } from '@/components/loginForm'

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-2xl">Logga in</h1>
        <LoginForm />
        <p className="text-center">
          Har du inget konto?{' '}
          <Link className="text-indigo-500 hover:underline" href="/register">
            Skapa ett
          </Link>{''}
        </p>
      </div>
    </div>
  )
}