import type { CreateTaskInput, UpdateTaskInput } from "./task.inputs.js";
import type { Task } from "./task.type.js";
import type { TaskRepository } from "./task.repository.js";

export class TaskService {
  // DI
  constructor(private readonly repository: TaskRepository) {}

  async listTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    // Busca o estado atual dos dados antes de persistir as novas mudanças
    const tasks = await this.repository.findAll();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      completed: false,
      createdAt: new Date(),
    };

    tasks.push(newTask);
    await this.repository.saveAll(tasks);

    return newTask;
  }
}
