# Utilitários

Esta seção documenta as funções utilitárias reutilizáveis da aplicação TaskCollab.

## formatDate.js

**Arquivo:** `src/utils/formatDate.js`

**Descrição:** Funções para formatação de datas.

### formatDate(dateString)

Converte uma string de data ISO para o formato brasileiro (dd/mm/yyyy).

**Parâmetros:**
- `dateString` (string): String de data no formato ISO (ex: "2023-05-20T14:30:00Z")

**Retorno:**
- (string): Data formatada no padrão dd/mm/yyyy (ex: "20/05/2023")

**Comportamento:**
- Retorna string vazia se `dateString` for nula ou inválida
- Utiliza a biblioteca `date-fns` para parsing e formatação

**Exemplo de uso:**
```javascript
import { formatDate } from "../utils/formatDate";

// Exibe: "20/05/2023"
console.log(formatDate("2023-05-20T14:30:00Z"));
```

## stringUtils.js

**Arquivo:** `src/utils/stringUtils.js`

**Descrição:** Funções para manipulação de strings.

### substituirEspacosPorUnderline(texto)

Remove espaços duplos, tabs e qualquer tipo de espaço, substituindo por um único underscore.

**Parâmetros:**
- `texto` (string): O texto a ser processado

**Retorno:**
- (string): O texto com espaços substituídos por underscores

**Comportamento:**
- Substitui qualquer sequência de espaços por um único underscore
- Remove espaços no início e fim da string

**Exemplo de uso:**
```javascript
import { substituirEspacosPorUnderline } from "../utils/stringUtils";

// Exibe: "John_Doe"
console.log(substituirEspacosPorUnderline("John  Doe"));

// Exibe: "user_name_example"
console.log(substituirEspacosPorUnderline("  user name  example  "));
```

**Uso no sistema:**
Esta função é utilizada principalmente no processo de autenticação para:
1. Normalizar nomes de usuário durante o registro
2. Processar credenciais de login quando não são emails

## taskUtils.js

**Arquivo:** `src/utils/taskUtils.js`

**Descrição:** Funções utilitárias específicas para manipulação de tarefas.

### Funções disponíveis:

- Funções para filtrar tarefas por status, prioridade, etc.
- Funções para ordenar tarefas por diferentes critérios
- Funções para validação de dados de tarefas

**Exemplo de uso:**
```javascript
import { filterTasksByPriority, sortTasksByDueDate } from "../utils/taskUtils";

// Filtra tarefas de alta prioridade
const highPriorityTasks = filterTasksByPriority(allTasks, 'high');

// Ordena tarefas por data de vencimento
const sortedTasks = sortTasksByDueDate(tasks);
```