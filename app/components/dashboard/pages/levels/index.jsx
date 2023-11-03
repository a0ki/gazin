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
    { name: 'USUÁRIOS', uid: 'users', sortable: true },
    { name: 'AÇÕES', uid: 'actions', sortable: false },
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

export const NiveisContent = () => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterValue, setFilterValue] = useState('');
    const hasSearchFilter = Boolean(filterValue);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: 'name',
        direction: 'ascending',
    });

    const [modalArgs, setModalArgs] = useState({});

    const roles = useAsyncList({
        async load({ signal }) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/role/list`, {
                    signal,
                });

                const json = await res.json();

                setIsLoading(false);
                return {
                    items: json.roles,
                };
            } catch (error) {
                toast.error('Falha ao requisitar usuários');
                console.error('error on /api/role/list: ' + error);
                return {
                    items: [],
                };
            }
        },
    });

    const filteredItems = useMemo(() => {
        let filteredRoles = [...roles.items];

        if (hasSearchFilter) {
            filteredRoles = filteredRoles.filter((role) =>
                role.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredRoles;
    }, [roles.items, filterValue]);

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

    const renderCell = useCallback((role, columnKey) => {
        const cellValue = role[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <>{role.name}</>
                );
            case 'users':
                return (
                    <>{role.users}</>
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
                        checkResourcePermissions(session, 'roles', 'create') ? (
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
                        Mostrando {sortedItems.length} de {roles.items.length} desenvolvedores
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

    return (
        <>
            <Table
                isHeaderSticky={true}
                aria-label='Tabela de niveis'
                classNames={{
                    wrapper: 'min-h-[200px]',
                }}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                topContent={topContent}
                topContentPlacement='outside'
                bottomContent={bottomContent}
                bottomContentPlacement='outside'
            >
                <TableHeader
                    aria-label='Cabeçalho da tabela de niveis'
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
                    aria-label='Corpo da tabela de niveis'
                    isLoading={isLoading}
                    loadingContent={<Spinner />}
                    emptyContent={!isLoading ? 'Nenhum nível encontrado' : null}
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