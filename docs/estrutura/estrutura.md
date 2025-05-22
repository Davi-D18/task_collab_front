# Estrutura do Projeto

Este documento descreve a organização e estrutura de pastas do front-end da aplicação TaskCollab.

## Visão Geral

O projeto segue uma estrutura modular organizada por funcionalidade, facilitando a manutenção e escalabilidade do código. A estrutura principal é baseada em componentes React, com separação clara entre componentes de UI, páginas, serviços e utilitários.

## Estrutura de Diretórios

```
src/
├── components/       # Componentes reutilizáveis
├── contexts/         # Contextos React para gerenciamento de estado
├── pages/            # Componentes de página (rotas)
├── services/         # Serviços para comunicação com APIs
├── styles/           # Estilos globais e módulos de estilo
├── utils/            # Funções utilitárias
├── App.jsx           # Componente raiz e configuração de rotas
└── main.jsx          # Ponto de entrada da aplicação
```

## Detalhamento das Pastas

### /src/components

Contém componentes reutilizáveis da interface do usuário, organizados por funcionalidade.

```
components/
├── Filters/                # Componentes para filtrar listas de tarefas
│   ├── FilterButton.jsx
│   ├── FilterButton.module.scss
│   ├── FilterGroup.jsx
│   └── FilterGroup.module.scss
├── FormControls/           # Campos de formulário reutilizáveis
│   ├── DateField.jsx
│   ├── SelectField.jsx
│   └── TextareaField.jsx
├── LoadingSpinner/         # Indicador de carregamento
│   ├── LoadingSpinner.jsx
│   └── LoadingSpinner.module.scss
├── Navbar/                 # Barra de navegação principal
│   ├── Navbar.jsx
│   └── Navbar.module.scss
├── ProtectedRoute/         # Componente para proteger rotas autenticadas
│   └── ProtectedRoute.jsx
├── Task/                   # Componentes relacionados à exibição de tarefas
│   ├── TaskDescription.jsx
│   ├── TaskHeader.jsx
│   └── TaskMetadata.jsx
├── TaskCard/               # Card para exibição de tarefas em listas
│   ├── TaskCard.jsx
│   └── TaskCard.module.scss
├── Toast/                  # Sistema de notificações
│   ├── Toast.jsx
│   ├── Toast.module.scss
│   ├── ToastContainer.jsx
│   └── ToastContainer.module.scss
└── UI/                     # Componentes de UI básicos
    ├── Button.jsx
    ├── Card.jsx
    ├── PriorityBadge.jsx
    └── StatusBadge.jsx
```

#### Padrão de Organização de Componentes

Cada componente segue uma estrutura consistente:
- Um arquivo JSX para a lógica e estrutura do componente
- Um arquivo SCSS Module para estilos específicos do componente
- Componentes relacionados agrupados em pastas

### /src/contexts

Contextos React para gerenciamento de estado global da aplicação.

```
contexts/
└── AuthContext.jsx    # Contexto para gerenciamento de autenticação
```

### /src/pages

Componentes de página que representam as diferentes rotas da aplicação.

```
pages/
├── CreateTask/           # Página para criação de novas tarefas
│   ├── CreateTask.jsx
│   └── CreateTask.module.scss
├── Dashboard/            # Página inicial com visão geral das tarefas
│   ├── Dashboard.jsx
│   └── Dashboard.module.scss
├── Login/                # Página de login
│   ├── Login.jsx
│   └── Login.module.scss
├── NotFound/             # Página de erro 404
│   ├── NotFound.jsx
│   └── NotFound.module.scss
├── Register/             # Página de registro de novos usuários
│   ├── Register.jsx
│   └── Register.module.scss
└── TaskDetail/           # Página de detalhes de uma tarefa específica
    ├── TaskDetail.jsx
    └── TaskDetail.module.scss
```

#### Padrão de Organização de Páginas

Cada página segue uma estrutura consistente:
- Um arquivo JSX para a lógica e estrutura da página
- Um arquivo SCSS Module para estilos específicos da página
- Páginas relacionadas agrupadas em pastas

### /src/services

Serviços para comunicação com a API externa e outras funcionalidades.

```
services/
└── api.js    # Configuração do Axios e serviços de API
```

### /src/styles

Estilos globais e módulos de estilo compartilhados.

```
styles/
├── buttons.module.scss       # Estilos para botões
├── descriptionText.module.scss # Estilos para textos descritivos
├── forms.module.scss         # Estilos para formulários
├── global.scss               # Estilos globais da aplicação
└── layout.module.scss        # Estilos de layout
```

### /src/utils

Funções utilitárias reutilizáveis em toda a aplicação.

```
utils/
├── formatDate.js     # Funções para formatação de datas
├── stringUtils.js    # Funções para manipulação de strings
└── taskUtils.js      # Funções utilitárias específicas para tarefas
```

## Arquivos Principais

### src/main.jsx

Componente raiz da aplicação que define as rotas principais usando React Router.

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/Toast/ToastContainer"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Dashboard from "./pages/Dashboard/Dashboard"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import CreateTask from "./pages/CreateTask/CreateTask"
import TaskDetail from "./pages/TaskDetail/TaskDetail"
import NotFound from "./pages/NotFound/NotFound"
import "./App.scss"

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            } />
            <Route path="/task/:id" element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
```

### src/App.jsx

Ponto de entrada da aplicação, onde todos os componentes são exibidos no `App.jsx`.

```jsx
import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import { ToastContainer } from "./components/Toast/ToastContainer"
import "./App.scss"

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}

export default App

```

## Arquivos de Configuração

### vite.config.js

Configuração do Vite para build e desenvolvimento.

### .env

Variáveis de ambiente para configuração da aplicação.

```
VITE_API_URL=https://api.taskcollab.com/
```

## Padrões de Código

- **Componentes**: Utilizam a sintaxe de função com hooks React
- **Estilos**: CSS Modules com SCSS para estilos com escopo local
- **Estado Global**: Context API para gerenciamento de estado global
- **Requisições HTTP**: Axios para comunicação com a API
- **Roteamento**: React Router para navegação entre páginas