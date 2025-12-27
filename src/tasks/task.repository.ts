import type { Task } from "./task.type.js";

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  saveAll(tasks: Task[]): Promise<void>;
}
