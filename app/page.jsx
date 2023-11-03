'use client'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import LoginForm from './components/login';

export default function IndexPage() {
  const { data: session } = useSession();
  if (session && session.data) {
    return redirect('/dashboard');
  }
  return (
    <main className='p-4 md:p-10 mx-auto max-w-7xl'>
      <LoginForm />
    </main>
  );
}