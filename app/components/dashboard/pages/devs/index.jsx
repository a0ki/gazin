import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAsyncList } from '@react-stately/data';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    User,
    Pagination,
    Spinner,
    Select,
    SelectItem,
} from '@nextui-org/react';
import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CustomModal } from '../../../modals'

const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const columns = [
    { name: 'NOME', uid: 'name', sortable: true },
    { name: 'NIVEL', uid: 'role', sortable: true },
];

const formatDate = (dateString) => {
    if (!dateString)
        return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

const checkResourcePermissions = (session, resourceName, action) => {
    if (
        !session?.data?.role ||
        !session.data.role.resources ||
        !resourceName ||
        !action
    ) {
        return false;
    }

    const resourcePermissions = session.data.role.resources.find(
        (resource) => resource.resource.toLowerCase() === resourceName.toLowerCase()
    );

    if (!resourcePermissions) {
        return false;
    }

    const { permission } = resourcePermissions;

    switch (action) {
        case 'read':
            return permission.read;
        case 'create':
            return permission.create;
        case 'update':
            return permission.update;
        case 'delete':
            return permission.delete;
        default:
            return false;
    }
};

export const DevsContent = () => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterValue, setFilterValue] = useState('');
    const hasSearchFilter = Boolean(filterValue);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: 'age',
        direction: 'ascending',
    });

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [modalArgs, setModalArgs] = useState({});
    const [roles, setRoles] = useState([]);

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const openModal = (actionName, args) => {
        setModalArgs(args);
        if (actionName === 'create') {
            setCreateModalOpen(true);
        } else if (actionName === 'update') {
            setUpdateModalOpen(true);
        } else if (actionName === 'delete') {
            setDeleteModalOpen(true);
        }
    };

    useEffect(() => {
        if (
            checkResourcePermissions(session, 'users', 'update') ||
            checkResourcePermissions(session, 'users', 'delete')
        ) {
            const actionsColumnExists = columns.some((column) => column.uid === 'actions');
            if (!actionsColumnExists) {
                columns.push({ name: 'AÇÕES', uid: 'actions', sortable: true });
            }
        }
    }, []);

    const users = useAsyncList({
        async load({ signal }) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/list`, {
                    signal,
                });

                const json = await res.json();

                if (checkResourcePermissions(session, 'roles', 'read')) {
                    const rolesRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/role/list`);
                    if (rolesRes.ok) {
                        const roles = await rolesRes.json();
                        setRoles(roles.roles);
                    }
                }

                setIsLoading(false);
                return {
                    items: json.results,
                };
            } catch (error) {
                toast.error('Falha ao requisitar usuários');
                console.error('error on /api/user/list: ' + error);
                return {
                    items: [],
                };
            }
        },
    });

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users.items];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.role.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.email.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredUsers;
    }, [users.items, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue('');
        setPage(1);
    }, []);

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <User
                        avatarProps={{ radius: 'lg', src: null }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case 'role':
                return (
                    <div className='flex flex-col'>
                        <p className='text-bold text-small capitalize'>{cellValue}</p>
                    </div>
                );
            case 'actions':
                return (
                    <div className='relative flex justify-end items-center gap-2'>
                        <Dropdown aria-label='Ações da tabela de desenvolvedores'>
                            <DropdownTrigger>
                                <Button isIconOnly size='sm' variant='light'>
                                    <EllipsisVerticalIcon className='text-default-300' />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label='Menu de ações'>
                                {checkResourcePermissions(session, 'users', 'update') ? <DropdownItem aria-label='Editar' onPress={() => openModal('update', user)}>Editar</DropdownItem> : null}
                                {checkResourcePermissions(session, 'users', 'delete') ? <DropdownItem aria-label='Deletar' onPress={() => openModal('delete', user)}>Deletar</DropdownItem> : null}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between gap-3 items-end'>
                    <Input
                        isClearable
                        className='w-full sm:max-w-[44%]'
                        placeholder='Buscar...'
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                    {
                        checkResourcePermissions(session, 'users', 'create') ? (
                            <div className='flex gap-3'>
                                <Button key='add-new-user' color="success" className='text-white' endContent={<PlusIcon width={13} />} onPress={async () => openModal('create')}>
                                    Adicionar Novo
                                </Button>
                            </div>
                        ) : null
                    }
                </div>
                <div className='flex justify-between items-center'>
                    <span className='text-default-400 text-small'>
                        Mostrando {sortedItems.length} de {users.items.length} desenvolvedores
                    </span>
                    <label className='flex items-center text-default-400 text-small'>
                        Linhas por página:
                        <select
                            className='bg-transparent outline-none text-default-400 text-small'
                            onChange={onRowsPerPageChange}
                        >
                            <option value='5'>5</option>
                            <option value='10'>10</option>
                            <option value='15'>15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, onRowsPerPageChange, sortedItems, onSearchChange, hasSearchFilter]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className='flex w-full justify-center'>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color='primary'
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    const onUpdateUserChange = (e) => {
        setModalArgs({
            ...modalArgs,
            [e.target.name]: e.target.value
        });
    }

    return (
        <>
            <CustomModal
                isOpen={createModalOpen}
                onClose={closeCreateModal}
                title="Adicionar desenvolvedor"
                content={
                    <div>
                        <Input
                            id='create-name'
                            type='text'
                            name='name'
                            placeholder='Nome'
                            description='Nome'
                            variant='underlined'
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='create-email'
                            type='text'
                            name='email'
                            placeholder='E-mail'
                            description='E-mail'
                            variant='underlined'
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='create-password'
                            type='password'
                            name='password'
                            placeholder='Senha'
                            description='Senha'
                            variant='underlined'
                            onChange={onUpdateUserChange}
                        />
                        <Select
                            id='create-role'
                            name='role'
                            variant='underlined'
                            className='w-[400px] bg-zinc-100/40'
                            label='Nivel'
                            placeholder='Nivel'
                            onChange={onUpdateUserChange}
                        >
                            {
                                roles.map((role, index) => (
                                    <SelectItem key={role.name} value={role._id}>
                                        {role.name}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                        <Input
                            id='create-gender'
                            type='text'
                            name='gender'
                            placeholder='Gênero'
                            description='Gênero'
                            variant='underlined'
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='create-age'
                            type='number'
                            name='age'
                            placeholder='Idade'
                            description='Idade'
                            variant='underlined'
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='create-birthdate'
                            type='date'
                            name='birthdate'
                            variant='underlined'
                            className='w-[400px] bg-zinc-100/40'
                            placeholder='Data de Nascimento'
                            description='Data de Nascimento'
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='create-hobby'
                            type='text'
                            name='hobby'
                            placeholder='Hobby'
                            description='Hobby'
                            variant='underlined'
                            onChange={onUpdateUserChange}
                        />
                        <Select
                            id='create-status'
                            name='status'
                            variant='underlined'
                            className='w-[400px] bg-zinc-100/40'
                            label='Status'
                            placeholder='Status'
                            onChange={onUpdateUserChange}
                        >
                            <SelectItem key='active' value='active'>
                                Ativo
                            </SelectItem>
                            <SelectItem key='paused' value='paused'>
                                Pausado
                            </SelectItem>
                            <SelectItem key='vacation' value='vacation'>
                                Férias
                            </SelectItem>
                        </Select>
                    </div>
                }
                actions={[
                    {
                        label: 'Fechar',
                        color: 'danger',
                        variant: 'light',
                        callback: () => { },
                    },
                    {
                        label: 'Criar',
                        color: 'success',
                        className: 'text-white',
                        callback: async () => {
                            try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/add`, {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        id: modalArgs._id,
                                        name: modalArgs.name,
                                        password: modalArgs.password,
                                        email: modalArgs.email,
                                        role: modalArgs.role,
                                        gender: modalArgs.gender,
                                        age: modalArgs.age,
                                        birthdate: modalArgs.birthdate,
                                        hobby: modalArgs.hobby,
                                        status: modalArgs.status,
                                    })
                                });

                                if (!res.ok) {
                                    return toast.error(await res.text());
                                }
                                users.reload();
                                toast.success('Usuário criado com sucesso.');
                            } catch (error) {
                                console.log(error);
                                toast.error('Error desconhecido ao criar usuário.');
                            }
                        },
                    },
                ]}
            />
            <CustomModal
                isOpen={updateModalOpen}
                onClose={closeUpdateModal}
                title="Alterar desenvolvedor"
                content={
                    <div>
                        <Input
                            id='update-name'
                            type='text'
                            name='name'
                            placeholder='Nome'
                            description='Nome'
                            variant='underlined'
                            value={modalArgs?.name}
                            onChange={onUpdateUserChange}
                        />
                        <Select
                            id='update-role'
                            name='role'
                            variant='underlined'
                            className='w-[400px] bg-zinc-100/40'
                            label='Nivel'
                            placeholder='Nivel'
                            onChange={onUpdateUserChange}
                            selectedKeys={[modalArgs?.role]}
                        >
                            {
                                roles.map((role, index) => (
                                    <SelectItem key={role.name} value={role._id}>
                                        {role.name}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                        <Input
                            id='update-gender'
                            type='text'
                            name='gender'
                            placeholder='Gênero'
                            description='Gênero'
                            variant='underlined'
                            value={modalArgs?.gender}
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='update-age'
                            type='number'
                            name='age'
                            placeholder='Idade'
                            description='Idade'
                            variant='underlined'
                            value={modalArgs?.age}
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='update-birthdate'
                            type='date'
                            name='birthdate'
                            variant='underlined'
                            className='w-[400px] bg-zinc-100/40'
                            placeholder='Data de Nascimento'
                            description='Data de Nascimento'
                            value={formatDate(modalArgs?.birthdate)}
                            onChange={onUpdateUserChange}
                        />
                        <Input
                            id='update-hobby'
                            type='text'
                            name='hobby'
                            placeholder='Hobby'
                            description='Hobby'
                            variant='underlined'
                            value={modalArgs?.hobby}
                            onChange={onUpdateUserChange}
                        />
                        <Select
                            id='update-status'
                            name='status'
                            variant='underlined'
                            className='w-[400px] bg-zinc-100/40'
                            label='Status'
                            placeholder='Status'
                            onChange={onUpdateUserChange}
                            selectedKeys={[modalArgs?.status]}
                        >
                            <SelectItem key='active' value='active'>
                                Ativo
                            </SelectItem>
                            <SelectItem key='paused' value='paused'>
                                Pausado
                            </SelectItem>
                            <SelectItem key='vacation' value='vacation'>
                                Férias
                            </SelectItem>
                        </Select>
                    </div>
                }
                actions={[
                    {
                        label: 'Fechar',
                        color: 'danger',
                        variant: 'light',
                        callback: () => { },
                    },
                    {
                        label: 'Salvar',
                        color: 'success',
                        className: 'text-white',
                        callback: async () => {
                            try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/update`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({
                                        id: modalArgs._id,
                                        name: modalArgs.name,
                                        role: modalArgs.role,
                                        gender: modalArgs.gender,
                                        age: modalArgs.age,
                                        birthdate: modalArgs.birthdate,
                                        hobby: modalArgs.hobby,
                                        status: modalArgs.status,
                                    })
                                });

                                if (!res.ok) {
                                    return toast.error(await res.text());
                                }
                                users.reload();
                                toast.success('Usuário atualizado com sucesso.');
                            } catch (error) {
                                console.log(error);
                                toast.error('Error desconhecido ao atualizar usuário.');
                            }
                        },
                    },
                ]}
            />
            <CustomModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                title="Deletar desenvolvedor"
                content="Você tem certeza que deseja fazer isso? Esta operação não pode ser desfeita."
                actions={[
                    {
                        label: 'Fechar',
                        color: 'danger',
                        variant: 'light',
                        callback: () => { },
                    },
                    {
                        label: 'Deletar',
                        color: 'danger',
                        callback: async () => {
                            try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/delete`, {
                                    method: 'DELETE',
                                    body: JSON.stringify({
                                        id: modalArgs._id
                                    })
                                });

                                if (!res.ok) {
                                    return toast.error(await res.text());
                                }
                                users.reload();
                                toast.success('Usuário removido com sucesso.');
                            } catch (error) {
                                console.log(error);
                                toast.error('Error desconhecido ao deletar usuário.');
                            }
                        },
                    },
                ]}
            />
            <Table
                isHeaderSticky={true}
                aria-label='Tabela de desenvolvedores'
                classNames={{
                    wrapper: 'max-h-[382px] min-h-[200px]',
                }}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                topContent={topContent}
                topContentPlacement='outside'
                bottomContent={bottomContent}
                bottomContentPlacement='outside'
            >
                <TableHeader
                    aria-label='Cabeçalho da tabela de desenvolvedores'
                    columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === 'actions' ? 'center' : 'start'}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    aria-label='Corpo da tabela de desenvolvedores'
                    isLoading={isLoading}
                    loadingContent={<Spinner />}
                    emptyContent={!isLoading ? 'Nenhum usuário encontrado' : null}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.name}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};