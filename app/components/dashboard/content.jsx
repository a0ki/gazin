'use client';
import React from 'react';
import { Tabs, Tab, Card, CardBody, Progress } from '@nextui-org/react';
import { HomeIcon, CommandLineIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { DashboardContent, DevsContent, NiveisContent } from './pages';
import LoadingProgress from '../loading'

/**
 * Função que retorna os itens dos tabs com base nos recursos do usuário.
 * @param {Object} session - A sessão do usuário.
 * @returns {Array} - Uma lista de itens dos tabs.
 */
const getTabItems = (session) => {
    const roleResources = session?.data?.role?.resources.map(resource => resource.resource.toLowerCase());

    const tabItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            content: <DashboardContent
                name={session.data.name}
                email={session.data.email}
                idade={session.data.age}
                gender={session.data.gender}
                birthdate={session.data.birthdate} />,
            icon: HomeIcon,
        },
    ];

    if (roleResources.includes('users')) {
        tabItems.push({
            id: 'devs',
            label: 'Devs',
            content: <DevsContent />,
            icon: CommandLineIcon,
        });
    }
    if (roleResources.includes('roles')) {
        tabItems.push({
            id: 'roles',
            label: 'Níveis',
            content: <NiveisContent />,
            icon: FunnelIcon,
        });
    }

    return tabItems;
};

/**
 * Componente Content que exibe os tabs com base na sessão do usuário.
 */
const Content = () => {
    const { data: session } = useSession();

    if (!session) {
        return <LoadingProgress />;
    }

    const tabItems = getTabItems(session);

    return (
        <div className='shadow-lg rounded-lg border-t-4 border-blue-gazin min-w-[500px] min-h-[50px]'>
            <div className='flex flex-col h-full'>
                <Tabs color='primary' variant='underlined' items={tabItems}>
                    {(item) => (
                        <Tab key={item.id} title={
                            <div className='flex items-center space-x-2'>
                                {React.createElement(item.icon, { width: 20 })}
                                <span>{item.label}</span>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {item.content}
                                </CardBody>
                            </Card>
                        </Tab>
                    )}
                </Tabs>
            </div>
        </div>
    );
};

export default Content;