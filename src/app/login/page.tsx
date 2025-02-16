'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCsrfToken, signIn } from 'next-auth/react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    getCsrfToken().then(token => setCsrfToken(token || ''));
  }, []);

  const onSubmit = async (data) => {
    await signIn('email', { email: data.email, csrfToken });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input {...register('email')} id="email" type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign In with Email
        </button>
        <div className="mt-4 text-center">
          <div className="text-gray-500 mb-3">or</div>
          <button type="button" onClick={() => signIn('google')} className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <GoogleIcon className="h-5 w-5" />
            Sign In with Google
          </button>
        </div>
      </form>
    </div>
  );
}
