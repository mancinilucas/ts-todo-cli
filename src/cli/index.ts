import path from "path";
import { FileTaskRepository } from "../infra/file-task.repository.js";
import { TaskService } from "../tasks/task.service.js";
import { TaskNotFoundError } from "../core/errors.js";

const DATA_FILE = path.resolve(process.cwd(), "data/tasks.json");

const repository = new FileTaskRepository(DATA_FILE);
const service = new TaskService(repository);

const argsFromCli = process.argv.slice(2);
const [command, ...args] =
  argsFromCli[0] === "--" ? argsFromCli.slice(1) : argsFromCli;

async function main() {
  switch (command) {
    case "add":
      await handleAdd(args);
      break;

    case "list":
      await handleList();
      break;

    case "done":
      await handleDone(args);
      break;

    case "remove":
      await handleRemove(args);
      break;

    default:
      printHelp();
  }
}

async function handleAdd(args: string[]) {
  const title = args.join(" ").trim();

  if (!title) {
    console.error("Error: O título da tarefa é obrigatório.");
    process.exit(1);
  }

  const task = await service.createTask({ title });
  console.log(`Tarefa criada: ${task.title}`);
}

async function handleList() {
  const tasks = await service.listTasks();

  if (tasks.length === 0) {
    console.log("Nenhuma tarefa encontrada.");
    return;
  }

  console.log("Tarefas:");
  for (const task of tasks) {
    const mark = task.completed ? " X " : " ";
    console.log(`- [${mark}] ${task.title} (id: ${task.id})`);
  }
}

async function handleDone(args: string[]) {
  const [taskId] = args;

  if (!taskId) {
    console.error("Error: O id da tarefa é obrigatório.");
    process.exit(1);
  }

  try {
    const updated = await service.updateTask(taskId, { completed: true });
    console.log(`Tarefa marcada como concluída: ${updated.title}`);
  } catch (err: unknown) {
    handleCliError(err);
  }
}

async function handleRemove(args: string[]) {
  const [taskId] = args;

  if (!taskId) {
    console.error("Error: O id da tarefa é obrigatório.");
    process.exit(1);
  }

  try {
    await service.removeTask(taskId);
    console.log(`Tarefa removida: ${taskId}`);
  } catch (err: unknown) {
    handleCliError(err);
  }
}

function handleCliError(err: unknown): void {
  if (err instanceof TaskNotFoundError) {
    console.error("Erro: Tarefa não encontrada.");
    return;
  }
  throw err;
}

function printHelp() {
  console.log(`
      Uso:
       todo add <título>
       todo list
       todo done <id>
       todo remove <id>
    `);
}

main().catch((error) => {
  console.error("Erro inesperado:", error);
  process.exit(1);
});
