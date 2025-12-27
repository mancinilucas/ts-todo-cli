export type CreateTaskInput = {
  title: string;
};

export type UpdateTaskInput = {
  title?: string;
  completed?: boolean;
};
