import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import logoSvg from '../../../public/static/logo.svg';
import { Input, Button } from '@nextui-org/react';

export default function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email === '' || !form.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
      toast.error('Digite um e-mail válido');
      return;
    }
    if (form.password === '' || form.password.length < 6) {
      toast.error('Digite uma senha válida');
      return;
    }

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (res?.error) {
      toast.error('Credenciais inválidas');
      return;
    }
    setTimeout(() => router.push('/dashboard'));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateField = (field) => {
    switch (field) {
      case 'email':
        if (form.email === '') return false;
        return form.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i) ? false : true;
      case 'password':
        if (form.password === '') return false;
        return !(form.password.length >= 6);
      default:
        return false;
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='shadow-lg p-5 rounded-lg border-t-4 border-blue-gazin'>
        <Image src={logoSvg} alt='Logo' width={400} className='mb-4' />

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <Input
            onChange={handleFormChange}
            type='text'
            name='email'
            placeholder='E-mail'
            className='max-w-md'
            isInvalid={validateField('email')}
            errorMessage={validateField('email') && 'Digite um e-mail válido'}
          />
          <Input
            onChange={handleFormChange}
            type='password'
            name='password'
            placeholder='Senha'
            className='max-w-md'
          />
          <Button type='submit' color='primary' loading={false} className='text-white'>
            Login
          </Button>
          <Link href={'/register'}>
            Não tem uma conta? <span className='underline'>Cadastre-se</span>.
          </Link>
        </form>
      </div>
    </div>
  );
}