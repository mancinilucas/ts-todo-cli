**Projeto**

O `cli-todo` é um projeto de estudo em TypeScript que implementa uma pequena CLI/estrutura para gerenciar tarefas usando um repositório baseado em arquivo (`data/tasks.json`) como armazenamento.

**Objetivo**

- **Descrição:** Estudar padrões de TypeScript e organização de projeto (repos, serviços e I/O de arquivo).

**Versões recomendadas**

- **Node:** >= 18 (testado com Node 24)
- **pnpm:** conforme `packageManager` em `package.json` (ex.: pnpm@10)
- **TypeScript:** ^5.9 (ver `devDependencies`)

**Arquitetura**

- **`src/`**: código-fonte principal.
- **`src/infra/`**: implementações de infraestrutura (ex.: `FileTaskRepository`).
- **`src/tasks/`**: tipos, repositório e serviços relacionados a tarefas (`task.type.ts`, `task.repository.ts`, `task.service.ts`).
- **`src/cli/` e `src/core/`**: pontos para extensão da CLI e lógica central.
- **`data/tasks.json`**: arquivo JSON que atua como banco de dados local para as tasks.

**Execução**

- Instalar dependências:

```bash
pnpm install
```

- Rodar em modo desenvolvimento (usa `ts-node` via script `dev`):

```bash
pnpm run dev
```

- Compilar (gera `dist/`):

```bash
pnpm run build
```

- Executar build compilado (testar funcionalidades):

Modo recomendado (usar o script de start):

```bash
pnpm run start -- <comando>
```

Alternativa (executar diretamente o binário compilado):

```bash
node dist/cli/index.js <comando>
```

Comandos disponíveis:

- `add <título>` — cria uma nova tarefa
- `list` — lista todas as tarefas (mostra `id` e estado `[ X ]`/`[   ]`)
- `done <id>` — marca a tarefa como concluída
- `remove <id>` — remove a tarefa

Exemplo:

```bash
pnpm run start -- list
```
