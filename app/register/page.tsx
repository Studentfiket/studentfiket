import Link from 'next/link'
import { RegisterForm } from './registerForm'
import { Suspense } from 'react'

export default function RegisterPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-2xl">Skapa konto</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </Suspense>
        <p className="text-center">
          Har du redan ett konto?{' '}
          <Link className="text-indigo-500 hover:underline" href="/login">
            Logga in
          </Link>{' '}
        </p>
      </div>
    </div>
  )
}