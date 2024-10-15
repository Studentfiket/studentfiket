'use client'

import Link from 'next/link'
import { RegisterForm } from './registerForm'
import ConfirmationMessage from './confirmationMessage'
import { useState } from 'react'

export default function RegisterPage() {
  function confirmationCallback() {
    setShowConfirmation(true)
  }

  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <div className="h-[92vh] w-full flex justify-center items-center bg-slate-100">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-2xl">Skapa konto</h1>
        {!showConfirmation ?
          <RegisterForm confirmationCallback={confirmationCallback} /> :
          <ConfirmationMessage />
        }
        {!showConfirmation && (<p className="text-center">
          Har du redan ett konto?{' '}
          <Link className="text-indigo-500 hover:underline" href="/login">
            Logga in
          </Link>
        </p>)}
      </div>
    </div>
  )
}