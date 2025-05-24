# Documentação do Front-end TaskCollab

Esta documentação fornece uma visão geral completa da estrutura e funcionamento do front-end da aplicação TaskCollab.

## Índice

1. [Estrutura do Projeto](./estrutura/estrutura.md)
2. [Componentes](./components/components.md)
3. [Contextos](./contexts/context.md)
4. [Páginas](./pages/pages.md)
5. [Serviços](./services/services.md)
6. [Utilitários](./utils/utils.md)
7. [Estilos](./styles/styles.md)
8. [Fluxos](./fluxos/autenticacao.md)

## Visão Geral

TaskCollab é uma aplicação web para gerenciamento de tarefas, permitindo que usuários criem, visualizem e gerenciem suas tarefas. A aplicação é construída com React e utiliza diversas bibliotecas modernas para fornecer uma experiência de usuário fluida e responsiva.

## Tecnologias Principais

- **React**: Biblioteca JavaScript para construção de interfaces de usuário
- **React Router**: Gerenciamento de rotas na aplicação
- **Axios**: Cliente HTTP para comunicação com a API
- **SCSS Modules**: Estilização com escopo local para componentes
- **Vite**: Ferramenta de build rápida para desenvolvimento moderno

## Arquitetura

A aplicação segue uma arquitetura baseada em componentes com gerenciamento de estado centralizado usando Context API. Os principais aspectos da arquitetura incluem:

### Componentes

Componentes reutilizáveis organizados por funcionalidade, seguindo o princípio de responsabilidade única. Cada componente é acompanhado por seu próprio arquivo de estilo usando SCSS Modules.

### Gerenciamento de Estado

- **Estado Local**: Gerenciado com o hook `useState` para estado específico de componentes
- **Estado Global**: Gerenciado com Context API para dados compartilhados entre componentes
- **Estado de Autenticação**: Gerenciado pelo AuthContext, que lida com login, registro e sessões de usuário

### Comunicação com API

A comunicação com o backend é centralizada no serviço de API, que configura o Axios com interceptores para lidar com tokens de autenticação e erros.

### Roteamento

O roteamento é gerenciado pelo React Router, com proteção de rotas para páginas que requerem autenticação.

## Como Usar Esta Documentação

Esta documentação está organizada em seções que correspondem às principais áreas do código-fonte. Cada seção contém informações detalhadas sobre os componentes, funções e fluxos de trabalho relacionados.

Para começar, recomendamos explorar a [Estrutura do Projeto](./estrutura/estrutura.md) para entender como o código está organizado, seguido pelos [Componentes](./components/components.md) para conhecer os blocos de construção da interface.

## Fluxos Principais

- [Autenticação](./fluxos/autenticacao.md): Registro, login, logout e refresh de token
- [Tarefas](./fluxos/tarefas.md): Criação, visualização, edição e exclusão de tarefas