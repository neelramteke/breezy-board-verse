
export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  taskId: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}
