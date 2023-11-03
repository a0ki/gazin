// Importe as dependências necessárias

import { NextResponse } from 'next/server';
import dbConnect from '../../lib/db';
import { User, Role } from '../../lib/models';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
    // Extraia os dados da solicitação
    const { name, email, password, gender, birthdate, hobby } = await request.json();
    if (!name || !email || !password || !gender || !birthdate || !hobby) {
        return new NextResponse('Parametros necessários não encontrados', { status: 400 });
    }

    // Conecta-se ao banco de dados
    await dbConnect();

    // Verifique se já existe um usuário com o mesmo e-mail
    const existingUser = await User.findOne({ email });

    // Se o usuário existir, retorne um erro
    if (existingUser) {
        return new NextResponse('Uma conta já está cadastrada com este e-mail.', { status: 400 });
    }

    // Faça o hash da senha
    const hashedPassword = await bcrypt.hash(password, 5);

    // Obtenha o papel do usuário (role) - Exemplo: Junior
    const role = await Role.findOne({ name: 'Junior' });

    // Calcular data de nascimento
    const age = Math.floor((new Date() - new Date(birthdate)) / 31536000000);

    // Crie um novo usuário com os dados fornecidos
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role,
        gender: gender,
        age: age,
        hobby: hobby,
        status: 'active',
        birthdate: birthdate
    });

    try {
        // Tente salvar o novo usuário no banco de dados
        await newUser.save();
        return new NextResponse('Conta cadastrada com sucesso', { status: 200 });
    } catch (err) {
        // Em caso de erro, retorne um erro interno do servidor
        console.error(err);
        return new NextResponse(err, {
            status: 500,
        });
    }
}