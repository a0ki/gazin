# Gazin Tech Desafio - Painel Administrativo

Este projeto é um painel administrativo desenvolvido como parte do desafio para uma vaga na Gazin Tech. Ele permite o cadastro de desenvolvedores e níveis, utilizando a tecnologia Next.js. O painel possui três rotas principais:

- `/`: Rota de login, onde os usuários podem fazer login.
- `/register`: Rota de cadastro, onde novos usuários podem se registrar.
- `/dashboard`: Rota principal após o login, que contém uma Single Page Application (SPA) com três abas:

    1. **Dashboard**: Exibe as informações do usuário logado.
    2. **Devs**: Lista de desenvolvedores.
    3. **Níveis**: Lista de níveis.

**Funcionalidades do Painel:**

- Apenas o usuário com a função "Lead" pode cadastrar novos usuários, atualizar ou deletar usuários.
- Somente o usuário "Lead" pode cadastrar novos níveis, atualizar ou deletar níveis.
- Os usuários com a função "Lead" têm permissão para criar ou alterar um nível existente.

## Configurações do Projeto

Antes de executar o projeto, é importante configurar algumas variáveis de ambiente no arquivo `.env.local`. Aqui estão as variáveis de ambiente utilizadas no projeto e como configurá-las:

- `NEXTAUTH_URL`: A URL base do seu aplicativo. Por padrão, está configurado como `http://localhost:3000` para desenvolvimento local.

- `NEXT_PUBLIC_URL`: A URL pública do seu aplicativo. Por padrão, está configurado como `http://localhost:3000` para desenvolvimento local.

- `NEXTAUTH_SECRET`: Uma chave secreta usada para proteger sessões e tokens gerados pelo NextAuth. Certifique-se de que esta chave seja forte e única.

- `MONGODB_URI`: A URI de conexão com o seu banco de dados MongoDB.

Aqui está um exemplo de como o seu arquivo `.env.local` pode se parecer:

NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000
NEXTAUTH_SECRET=SuaChaveSecretaAqui
MONGODB_URI=suauridemongoaqui

## Executando o Projeto

Siga estas etapas para executar o projeto:

1. Certifique-se de que as configurações no arquivo `.env.local` estão corretas.

2. Instale as dependências do projeto usando `npm install` ou `yarn install`.

3. Inicie o servidor de desenvolvimento com o comando `npm run dev` ou `yarn dev`.

4. Acesse o aplicativo em seu navegador em `http://localhost:3000` (ou a URL que você definiu em `NEXTAUTH_URL` e `NEXT_PUBLIC_URL`).

Certifique-se de ter o Node.js e o MongoDB configurados corretamente em seu ambiente.

## Tecnologias Utilizadas

- Next.js
- NextAuth
- MongoDB
- Tailwind CSS
- Outras bibliotecas listadas no arquivo `package.json`.

Este projeto foi desenvolvido como parte de um desafio e pode ser utilizado como ponto de partida para aplicações mais complexas.
Divirta-se explorando o projeto e sinta-se à vontade para personalizá-lo e expandi-lo de acordo com suas necessidades!