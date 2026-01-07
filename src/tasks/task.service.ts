import type { CreateTaskInput, UpdateTaskInput } from "./task.inputs.js";
import type { Task } from "./task.type.js";
import type { TaskRepository } from "./task.repository.js";
import { TaskNotFoundError } from "../core/errors.js";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async listTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
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

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const tasks = await this.repository.findAll();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new TaskNotFoundError();

    const task = tasks[index]!;
    const updated: Task = {
      ...task,
      title: input.title ?? task.title,
      completed: input.completed ?? task.completed,
    };

    tasks[index] = updated;
    await this.repository.saveAll(tasks);

    return updated;
  }

  async removeTask(id: string): Promise<void> {
    const tasks = await this.repository.findAll();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new TaskNotFoundError();

    tasks.splice(index, 1);
    await this.repository.saveAll(tasks);
  }
}
