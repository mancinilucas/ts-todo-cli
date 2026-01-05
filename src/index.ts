import { FileTaskRepository } from "./infra/file-task.repository.js";
import { TaskService } from "./tasks/task.service.js";

const repository = new FileTaskRepository("data/tasks.json");
const service = new TaskService(repository);
