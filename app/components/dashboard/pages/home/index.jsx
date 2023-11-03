import { signOut } from 'next-auth/react';
import { Button } from '@nextui-org/react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/Sao_Paulo',
    };
    return date.toLocaleString('pt-BR', options);
};

export const DashboardContent = ({ name, email, idade, gender, birthdate }) => {
    return (
        <div>
            <div>
                Bem vindo, <span className='font-bold'>{name}</span>.
            </div>
            <div>
                E-mail: <span className='font-bold'>{email}</span>
            </div>
            <div>
                Idade: <span className='font-bold'>{idade}</span>
            </div>
            <div>
                Gênero: <span className='font-bold'>{gender}</span>
            </div>
            <div>
                Data de Nascimentp: <span className='font-bold'>{formatDate(birthdate)}</span>
            </div>
            <Button className='bg-red-500 px-6 py-2 mt-3 text-white' onClick={() => signOut()}>
                Sair
            </Button>
        </div >
    );
}