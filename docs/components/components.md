# Componentes

Esta seção documenta os componentes reutilizáveis da aplicação TaskCollab.

## Estrutura de Componentes

Os componentes estão organizados nas seguintes categorias:

## 1. Filters

Componentes para filtrar listas de tarefas.

### FilterButton

**Arquivo:** `src/components/Filters/FilterButton.jsx`

**Descrição:** Botão de filtro reutilizável que pode ser ativado ou desativado.

**Props:**
- `label` (string): Texto do botão
- `active` (boolean): Se o filtro está ativo
- `onClick` (Function): Função chamada ao clicar no botão

**Exemplo de uso:**
```jsx
<FilterButton 
  label="Prioridade Alta" 
  active={activeFilter === 'high'} 
  onClick={() => setActiveFilter('high')} 
/>
```

### FilterGroup

**Arquivo:** `src/components/Filters/FilterGroup.jsx`

**Descrição:** Componente para agrupar botões de filtro relacionados.

**Props:**
- `label` (string): Rótulo do grupo de filtros
- `icon` (ReactNode): Ícone opcional
- `children` (ReactNode): Botões de filtro

**Exemplo de uso:**
```jsx
<FilterGroup label="Prioridade" icon={<PriorityIcon />}>
  <FilterButton label="Alta" active={priority === 'high'} onClick={() => setPriority('high')} />
  <FilterButton label="Média" active={priority === 'medium'} onClick={() => setPriority('medium')} />
  <FilterButton label="Baixa" active={priority === 'low'} onClick={() => setPriority('low')} />
</FilterGroup>
```

## 2. FormControls

Campos de formulário reutilizáveis para construção de interfaces de entrada de dados.

### SelectField

**Arquivo:** `src/components/FormControls/SelectField.jsx`

**Descrição:** Campo de seleção (dropdown) reutilizável.

**Props:**
- `id` (string): ID do campo
- `label` (string): Rótulo do campo
- `value` (string): Valor selecionado
- `onChange` (Function): Função chamada quando o valor muda
- `options` (Array): Opções disponíveis para seleção (formato: `[{value: 'valor', label: 'Texto'}]`)
- `disabled` (boolean): Se o campo está desabilitado
- `style` (Object): Estilos adicionais para o select
- `icon` (ReactNode): Ícone opcional para exibir antes do select

**Exemplo de uso:**
```jsx
<SelectField
  id="priority"
  label="Prioridade"
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
  options={[
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' }
  ]}
  icon={<PriorityIcon />}
/>
```

### DateField

**Arquivo:** `src/components/FormControls/DateField.jsx`

**Descrição:** Campo para seleção de data.

### TextareaField

**Arquivo:** `src/components/FormControls/TextareaField.jsx`

**Descrição:** Campo de texto multilinha para entrada de conteúdo mais extenso.

## 3. LoadingSpinner

**Arquivo:** `src/components/LoadingSpinner/LoadingSpinner.jsx`

**Descrição:** Indicador de carregamento exibido durante operações assíncronas.

## 4. Navbar

**Arquivo:** `src/components/Navbar/Navbar.jsx`

**Descrição:** Barra de navegação principal da aplicação, exibindo o logo, links de navegação e controles de usuário.

## 5. ProtectedRoute

**Arquivo:** `src/components/ProtectedRoute/ProtectedRoute.jsx`

**Descrição:** Componente para proteger rotas que requerem autenticação. Redireciona para a página de login se o usuário não estiver autenticado.

**Props:**
- `children` (ReactNode): Componentes a serem renderizados se o usuário estiver autenticado

**Funcionamento:**
1. Verifica se o usuário está autenticado usando o `useAuth` hook
2. Exibe um spinner de carregamento enquanto verifica a autenticação
3. Redireciona para a página de login se o usuário não estiver autenticado
4. Renderiza os componentes filhos se o usuário estiver autenticado

**Exemplo de uso:**
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 6. Task

Componentes relacionados à exibição detalhada de tarefas.

### TaskHeader

**Arquivo:** `src/components/Task/TaskHeader.jsx`

**Descrição:** Exibe o cabeçalho de uma tarefa, incluindo título e controles.

### TaskDescription

**Arquivo:** `src/components/Task/TaskDescription.jsx`

**Descrição:** Exibe a descrição detalhada de uma tarefa.

### TaskMetadata

**Arquivo:** `src/components/Task/TaskMetadata.jsx`

**Descrição:** Exibe metadados da tarefa como data de criação, prioridade e status.

## 7. TaskCard

**Arquivo:** `src/components/TaskCard/TaskCard.jsx`

**Descrição:** Card para exibição de tarefas em listas e na dashboard. Mostra informações resumidas da tarefa.

## 8. Toast

Sistema de notificações para feedback ao usuário.

### Toast

**Arquivo:** `src/components/Toast/Toast.jsx`

**Descrição:** Componente individual de notificação.

### ToastContainer

**Arquivo:** `src/components/Toast/ToastContainer.jsx`

**Descrição:** Gerencia e exibe múltiplas notificações toast. Implementa um contexto React para permitir que qualquer componente dispare notificações.

**Funcionalidades:**
- `toast({ title, description, type })`: Função para criar uma nova notificação
- `dismissToast(id)`: Função para remover uma notificação específica

**Tipos de toast:**
- `default`: Notificação padrão (informativa)
- `success`: Notificação de sucesso
- `error`/`destructive`: Notificação de erro

**Exemplo de uso:**
```jsx
import { useToast } from "../components/Toast/ToastContainer";

function MyComponent() {
  const { toast } = useToast();
  
  const handleAction = () => {
    // Após uma ação bem-sucedida
    toast({
      title: "Sucesso",
      description: "Operação realizada com sucesso!",
      type: "success"
    });
  };
}
```

## 9. UI

Componentes de UI básicos reutilizáveis em toda a aplicação.

### Button

**Arquivo:** `src/components/UI/Button.jsx`

**Descrição:** Botão reutilizável com diferentes variantes visuais.

**Props:**
- `variant` (string): Variante do botão ('back', 'delete', 'edit', 'save', 'create')
- `onClick` (Function): Função chamada ao clicar no botão
- `disabled` (boolean): Se o botão está desabilitado
- `children` (ReactNode): Conteúdo do botão
- `type` (string): Tipo do botão ('button', 'submit', 'reset')

**Exemplo de uso:**
```jsx
<Button variant="save" onClick={handleSave} disabled={isLoading}>
  Salvar Alterações
</Button>
```

### Card

**Arquivo:** `src/components/UI/Card.jsx`

**Descrição:** Componente de card para agrupar conteúdo relacionado.

### PriorityBadge

**Arquivo:** `src/components/UI/PriorityBadge.jsx`

**Descrição:** Badge visual que indica a prioridade de uma tarefa (Alta, Média, Baixa).

### StatusBadge

**Arquivo:** `src/components/UI/StatusBadge.jsx`

**Descrição:** Badge visual que indica o status de uma tarefa (Pendente, Em Progresso, Concluída).