# TaskCollab - Front-end

Este repositório contém o front-end da aplicação TaskCollab, desenvolvido como parte de uma atividade do curso Técnico em Informática para Internet do SENAI.

## 📋 Sobre o Projeto

TaskCollab é uma aplicação web para gerenciamento de tarefas para uso interno em uma empresa fictícia, permitindo que usuários criem, visualizem e gerenciem suas tarefas de forma eficiente. A aplicação oferece recursos como:

- Autenticação de usuários (login/registro)
- Dashboard para visualização de tarefas
- Criação e edição de tarefas
- Visualização detalhada de tarefas
- Filtros e ordenação de tarefas

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **React Router** - Gerenciamento de rotas na aplicação
- **Axios** - Cliente HTTP para comunicação com a API
- **SCSS Modules** - Estilização com escopo local para componentes
- **Vite** - Ferramenta de build rápida para desenvolvimento
- **Context API** - Gerenciamento de estado global

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── contexts/         # Contextos React para gerenciamento de estado
├── pages/            # Componentes de página (rotas)
├── services/         # Serviços para comunicação com a API
├── styles/           # Estilos globais e módulos de estilo
├── utils/            # Funções utilitárias
├── App.jsx           # Componente raiz da aplicação
└── main.jsx          # Ponto de entrada da aplicação
```

### Principais Componentes

- **Navbar** - Barra de navegação principal
- **TaskCard** - Exibição de tarefas em formato de card
- **Filters** - Componentes para filtrar listas de tarefas
- **FormControls** - Campos de formulário reutilizáveis
- **Toast** - Sistema de notificações

### Páginas

- **Dashboard** - Página inicial com visão geral das tarefas
- **Login/Register** - Páginas de autenticação
- **CreateTask** - Página para criação de novas tarefas
- **TaskDetail** - Página de detalhes de uma tarefa específica
- **NotFound** - Página de erro 404

## 🔒 Autenticação

O sistema utiliza autenticação baseada em JWT (JSON Web Tokens) com:
- Token de acesso para autenticação de requisições
- Token de refresh para renovação automática da sessão
- Proteção de rotas para usuários não autenticados

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou pnpm

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/Davi-D18/task_collab_front.git
cd task_collab_front
```

2. Instale as dependências
```bash
npm install
# ou
pnpm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:
```
VITE_API_URL=<url-da-api>
```

4. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
# ou
pnpm dev
```

5. Para build de produção
```bash
npm run build
# ou
pnpm build
```

## 📚 Documentação

O projeto inclui documentação detalhada na pasta `docs/`, que cobre:
- Estrutura do projeto
- Componentes
- Contextos
- Fluxos de trabalho
- Serviços e utilitários

## 🔄 Fluxos Principais

### Fluxo de Autenticação
1. Registro de novo usuário
2. Login com credenciais
3. Renovação automática de token
4. Logout

### Fluxo de Tarefas
1. Criação de tarefas com título, descrição e prioridade
2. Visualização de tarefas na dashboard
3. Filtro e ordenação de tarefas
4. Visualização detalhada de uma tarefa específica

## 👨‍💻 Desenvolvido como parte do curso Técnico em Informática para Internet - SENAI

Este projeto foi desenvolvido como atividade prática para finalização de um módulo.