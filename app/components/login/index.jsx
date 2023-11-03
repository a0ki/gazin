import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import logoSvg from '../../../public/static/logo.svg';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      toast.error('Credenciais invalidas');
      return;
    }
    setTimeout(() => router.push('/dashboard'));
  };

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-lg p-5 rounded-lg border-t-4 border-blue-gazin'>
        <Image src={logoSvg} alt='Logo' width={400} className='mb-4' />

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type='text'
            placeholder='Email'
            className='w-[400px] border border-blue-gazin py-2 px-6 bg-zinc-100/40'
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
            className='w-[400px] border border-blue-gazin py-2 px-6 bg-zinc-100/40'
          />
          <button className='bg-blue-gazin text-white font-bold cursor-pointer px-6 py-2'>
            Login
          </button>
          <Link href={'/register'}>
            Não tem uma conta? <span className='underline'>Cadastre-se</span>.
          </Link>
        </form>
      </div>
    </div>
  );
}