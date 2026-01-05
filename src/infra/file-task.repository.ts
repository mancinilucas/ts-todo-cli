import { promises as fs } from "fs";
import path from "path";
import type { TaskRepository } from "../tasks/task.repository.js";
import type { Task } from "../tasks/task.type.js";

function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as any).code === "string"
  );
}

export class FileTaskRepository implements TaskRepository {
  constructor(private readonly filePath: string) {}

  async findAll(): Promise<Task[]> {
    try {
      const content = await fs.readFile(this.filePath, "utf-8");
      const raw = JSON.parse(content) as Array<
        Pick<Task, "id" | "title" | "completed"> & { createdAt: string }
      >;
      return raw.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
    } catch (err: unknown) {
      if (isErrnoException(err) && err.code === "ENOENT") return [];
      throw err;
    }
  }

  async saveAll(tasks: Task[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    const serializable = tasks.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));
    await fs.writeFile(
      this.filePath,
      JSON.stringify(serializable, null, 2),
      "utf-8"
    );
  }
}
