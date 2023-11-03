import { NextResponse } from 'next/server';
import { Role, User } from '../../../lib/models';
import { hasPermission } from '../../../lib/utils';

export async function PATCH(req) {
    try {
        const { id, name, gender, age, birthdate, hobby, status, role } = await req.json();

        if (!id || !name || !gender || !age || !birthdate || !hobby || !status || !role) {
            return Response.json('Parametros necessários não encontrados', { status: 400 });
        }

        if (!(await hasPermission(req, 'users', 'update'))) {
            return Response.json('Você não tem permissão para requisitar este endpoint.', { status: 403 });
        }

        if (!id) {
            return new NextResponse('Parametro ID não encontrado', { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return new NextResponse('Usuário não encontrado', { status: 400 });
        }

        const newRole = await Role.findOne({ name: role });

        await User.updateOne({ _id: id }, {
            ...(name && { name }),
            ...(gender && { gender }),
            ...(age && { age }),
            ...(birthdate && { birthdate }),
            ...(hobby && { hobby }),
            ...(status && { status }),
            ...(newRole && { role: newRole._id }),
        });

        return new Response({ message: 'Usuário atualziado com sucesso' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Error interno do servidor', { status: 500 });
    }
}