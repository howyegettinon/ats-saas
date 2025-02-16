// src/components/auth/LoginForm.tsx
'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { getCsrfToken } from 'next-auth/react'

export default function LoginForm() {
  const { register, handleSubmit } = useForm()
  const [csrfToken, setCsrfToken] = useState<string>('')

  useEffect(() => {
    getCsrfToken().then(token => setCsrfToken(token || ''))
  }, [])

  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <input {...register('email')} type="email" />
      <button type="submit">Sign In</button>
    </form>
  )
}

