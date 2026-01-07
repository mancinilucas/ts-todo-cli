import path from "path";
import { FileTaskRepository } from "../infra/file-task.repository.js";
import { TaskService } from "../tasks/task.service.js";

const DATA_FILE = path.resolve(process.cwd(), "data/tasks.json");

const repository = new FileTaskRepository("data/tasks.json");
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
    console.log(`- [${task.completed ? "x" : " "}] ${task.title}`);
  }
}

function printHelp() {
  console.log(`
      Uso:
       todo add <título>
       todo list  
    `);
}

main().catch((error) => {
  console.error("Erro inesperado:", error);
  process.exit(1);
});
