'use client'
import {
  Input,
  Select,
  Button,
  SelectItem,
} from '@nextui-org/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import logoSvg from '../../public/static/logo.svg';

export default function RegisterForm() {
  // Inicialização dos estados para os campos do formulário
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    birthdate: Date(),
    hobby: ''
  });
  const [isFetching, setIsFetching] = useState(false);

  // Obtém o objeto de roteamento para redirecionar o usuário após o registro
  const router = useRouter();

  // Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length <= 3) {
      toast.error('Digite seu nome completo');
      return;
    }
    if (!form.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
      toast.error('Digite um e-mail válido');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Digite uma senha de ao menos 6 caracteres');
      return;
    }
    if (form.password != form.confirmPassword) {
      toast.error('As suas senhas não coincidem');
      return;
    }
    if (form.age < 18) {
      toast.error('Digite uma idade válida');
      return;
    }

    try {
      // Envio dos dados do formulário para o servidor
      setIsFetching(true);
      const res = await fetch('/api/register', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          gender: form.gender,
          birthdate: form.birthdate,
          hobby: form.hobby
        }),
      });

      setIsFetching(false);

      // Lida com as respostas do servidor
      switch (res.status) {
        case 400:
          toast.error('Uma conta já foi registrada com este e-mail.');
          break;
        case 200:
          toast.success('Conta cadastrada com sucesso.');
          await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
          });
          router.push('/dashboard');
          break;
        default:
          toast.error('Erro desconhecido ao processar a solicitação.');
          break;
      }
    } catch (error) {
      toast.error(`Erro desconhecido: ${error}`);
    }
  };

  const validateField = (field) => {
    switch (field) {
      case 'email':
        if (form.email === '') return true;
        return form.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i) ? false : true;
      case 'password':
        if (form.password === '') return false;
        return !(form.password.length >= 6);
      case 'password-confirm':
        return !(form.password === form.confirmPassword);
      case 'age':
        if (form.password === 0) return true;
        return form.age < 18 ? true : false;
      default:
        return false;
    }
  };

  const onFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-lg p-5 rounded-lg border-t-4 border-blue-gazin'>
        <Image src={logoSvg} alt='Logo' width={400} className='mb-4' />

        <form id='register-form'
          autoComplete='off'
          onSubmit={handleSubmit}
          className='flex flex-col gap-3'>
          <Input
            id='register-name'
            type='text'
            name='name'
            variant='underlined'
            className='w-[400px] bg-zinc-100/40'
            placeholder='Nome'
            description='Seu nome completo'
            onChange={onFormChange}
          />
          <Input
            id='register-email'
            type='email'
            name='email'
            variant='underlined'
            className='w-[400px] bg-zinc-100/40'
            placeholder='Email'
            isInvalid={validateField('email')}
            color={validateField('email') ? 'danger' : 'success'}
            errorMessage={validateField('email') && 'Digite um e-mail válido'}
            description='Seu e-mail'
            onChange={onFormChange}
          />
          <Input
            id='register-passsword'
            type='password'
            name='password'
            variant='underlined'
            className='w-[400px] bg-zinc-100/40'
            placeholder='Senha'
            isInvalid={validateField('password')}
            color={validateField('password') ? 'danger' : 'success'}
            errorMessage={validateField('password') && 'Digite uma senha válida'}
            description='Sua senha'
            onChange={onFormChange}
          />
          <Input
            id='register-passsword-confirm'
            type='password'
            name='confirmPassword'
            variant='underlined'
            className='w-[400px] bg-zinc-100/40'
            placeholder='Senha'
            isInvalid={validateField('password-confirm')}
            color={validateField('password-confirm') ? 'danger' : 'success'}
            errorMessage={validateField('password-confirm') && 'As senhas não coincidem'}
            description='Confirme sua senha'
            onChange={onFormChange}
          />
          {form.gender === 'Custom' ? (
            <Input
              id='register-gender'
              type='text'
              name='gender'
              variant='underlined'
              className='w-[400px] bg-zinc-100/40'
              placeholder='Seu pronome'
              description='Gênero'
              onChange={onFormChange}
            />
          ) : (
            <Select
              name='gender'
              variant='underlined'
              className='w-[400px] bg-zinc-100/40'
              label='Gênero'
              placeholder='Gênero'
              onChange={onFormChange}
            >
              <SelectItem key='Masculino' value='Masculino'>Masculino</SelectItem>
              <SelectItem key='Feminino' value='Feminino'>Feminino</SelectItem>
              <SelectItem key='Privado' value='Prefiro não dizer'>Prefiro não dizer</SelectItem>
              <SelectItem key='Outro' value='Outro'>Outro</SelectItem>
            </Select>
          )}
          <Input
            id='register-birthdate'
            type='date'
            name='birthdate'
            variant='underlined'
            className='w-[400px] bg-zinc-100/40'
            placeholder='Data de Nascimento'
            description='Sua data de nascimento'
            onChange={onFormChange}
          />
          <Input
            isClearable
            id='register-hobby'
            type='text'
            name='hobby'
            variant='underlined'
            className='w-[400px] bg-zinc-100/40'
            placeholder='Hobby'
            description='Oque mais gosta de fazer?'
            onChange={onFormChange}
          />
          <Button type='submit' color='primary' className='text-white' isLoading={isFetching}>
            Registrar
          </Button>

          <Link href={'/'}>
            Já tem uma conta? <span className='underline'>Faça login</span>.
          </Link>
        </form>
      </div>
    </div>
  );
}