import { User, Role } from '../../../lib/models';
import { hasPermission } from '../../../lib/utils';

export async function POST(req) {
    try {
        const { name, email, password, gender, age, birthdate, hobby, status, role } = await req.json();

        if (!name || !email || !password || !gender || !age || !birthdate || !hobby || !status || !role) {
            return Response.json('Parâmetros necessários não encontrados', { status: 400 });
        }

        if (!(await hasPermission(req, 'users', 'create'))) {
            return Response.json('Você não tem permissão para requisitar este endpoint.', { status: 403 });
        }

        const newRole = await Role.findOne({ name: role });
        if (!newRole) {
            return Response.json('Função (role) não encontrada', { status: 400 });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            gender,
            age,
            birthdate,
            hobby,
            status,
            role: newRole._id,
        });

        await newUser.save();

        return Response({ message: 'Usuário criado com sucesso' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json('Erro interno do servidor', { status: 500 });
    }
}