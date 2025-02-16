'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCsrfToken } from 'next-auth/react';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    getCsrfToken().then(token => setCsrfToken(token || ''));
  }, []);

  const onSubmit = async (data) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
      <form method="post" action="/api/auth/signin/email" onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input {...register('email')} id="email" type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign In
        </button>
      </form>
    </div>
  );
}
