import { NextResponse } from 'next/server';
import { User } from '../../../lib/models';
import { hasPermission } from '../../../lib/utils';

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!(await hasPermission(req, 'users', 'delete'))) {
            return Response.json('Você não tem permissão para requisitar este endpoint.', { status: 403 });
        }

        if (!id) {
            return new NextResponse('Parametro ID não encontrado', { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return new NextResponse('Usuário não encontrado', { status: 400 });
        }

        await User.deleteOne({ _id: id });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Error interno do servidor', { status: 500 });
    }
}