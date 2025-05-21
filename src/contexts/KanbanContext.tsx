
import React, { createContext, useState, useContext, ReactNode } from "react";
import { mockBoards, generateId } from "../data/mockData";
import { Board, Column, Task, Comment } from "../types";
import { toast } from "sonner";

interface KanbanContextType {
  boards: Board[];
  activeBoard: Board | null;
  createBoard: (title: string) => void;
  setActiveBoard: (boardId: string) => void;
  updateBoard: (boardId: string, title: string) => void;
  deleteBoard: (boardId: string) => void;
  createColumn: (title: string, boardId: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  createTask: (columnId: string, boardId: string, title: string, description: string) => void;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string) => void;
  addComment: (taskId: string, text: string) => void;
  deleteComment: (commentId: string, taskId: string) => void;
  getShareableLink: (boardId: string) => string;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>(mockBoards);
  const [activeBoard, setActiveBoardState] = useState<Board | null>(boards[0] || null);

  const setActiveBoard = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId) || null;
    setActiveBoardState(board);
  };

  const createBoard = (title: string) => {
    const newBoard: Board = {
      id: generateId(),
      title,
      columns: [
        {
          id: generateId(),
          title: "To Do",
          boardId: "",
          tasks: [],
        },
        {
          id: generateId(),
          title: "In Progress",
          boardId: "",
          tasks: [],
        },
        {
          id: generateId(),
          title: "Done",
          boardId: "",
          tasks: [],
        },
      ],
    };

    // Set boardId for each column
    newBoard.columns.forEach(col => col.boardId = newBoard.id);

    setBoards([...boards, newBoard]);
    setActiveBoardState(newBoard);
    toast.success("Board created successfully");
  };

  const updateBoard = (boardId: string, title: string) => {
    const updatedBoards = boards.map((board) =>
      board.id === boardId ? { ...board, title } : board
    );
    setBoards(updatedBoards);

    if (activeBoard?.id === boardId) {
      setActiveBoardState({ ...activeBoard, title });
    }
    toast.success("Board updated successfully");
  };

  const deleteBoard = (boardId: string) => {
    const updatedBoards = boards.filter((board) => board.id !== boardId);
    setBoards(updatedBoards);

    if (activeBoard?.id === boardId) {
      setActiveBoardState(updatedBoards[0] || null);
    }
    toast.success("Board deleted successfully");
  };

  const createColumn = (title: string, boardId: string) => {
    const newColumn: Column = {
      id: generateId(),
      title,
      boardId,
      tasks: [],
    };

    const updatedBoards = boards.map((board) =>
      board.id === boardId
        ? { ...board, columns: [...board.columns, newColumn] }
        : board
    );

    setBoards(updatedBoards);

    if (activeBoard?.id === boardId) {
      setActiveBoardState({
        ...activeBoard,
        columns: [...activeBoard.columns, newColumn],
      });
    }
    toast.success("Column created successfully");
  };

  const updateColumn = (columnId: string, title: string) => {
    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) =>
        column.id === columnId ? { ...column, title } : column
      ),
    }));

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.map((column) =>
        column.id === columnId ? { ...column, title } : column
      );
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Column updated successfully");
  };

  const deleteColumn = (columnId: string) => {
    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.filter((column) => column.id !== columnId),
    }));

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.filter(
        (column) => column.id !== columnId
      );
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Column deleted successfully");
  };

  const createTask = (
    columnId: string,
    boardId: string,
    title: string,
    description: string
  ) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      columnId,
      boardId,
      comments: [],
    };

    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: board.columns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                tasks: [...column.tasks, newTask],
              };
            }
            return column;
          }),
        };
      }
      return board;
    });

    setBoards(updatedBoards);

    if (activeBoard?.id === boardId) {
      const updatedColumns = activeBoard.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          };
        }
        return column;
      });
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Task created successfully");
  };

  const updateTask = (taskId: string, data: Partial<Task>) => {
    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, ...data } : task
        ),
      })),
    }));

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, ...data } : task
        ),
      }));
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Task updated successfully");
  };

  const deleteTask = (taskId: string) => {
    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      })),
    }));

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }));
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Task deleted successfully");
  };

  const moveTask = (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string
  ) => {
    // First find the task in the source column
    let taskToMove: Task | undefined;
    let updatedBoards = boards.map((board) => {
      const updatedColumns = board.columns.map((column) => {
        if (column.id === sourceColumnId) {
          const task = column.tasks.find((t) => t.id === taskId);
          if (task) {
            taskToMove = { ...task, columnId: destinationColumnId };
          }
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== taskId),
          };
        }
        return column;
      });
      return { ...board, columns: updatedColumns };
    });

    // Then add it to the destination column
    if (taskToMove) {
      updatedBoards = updatedBoards.map((board) => {
        const updatedColumns = board.columns.map((column) => {
          if (column.id === destinationColumnId) {
            return {
              ...column,
              tasks: [...column.tasks, taskToMove as Task],
            };
          }
          return column;
        });
        return { ...board, columns: updatedColumns };
      });
    }

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== taskId),
          };
        }
        if (column.id === destinationColumnId && taskToMove) {
          return {
            ...column,
            tasks: [...column.tasks, taskToMove],
          };
        }
        return column;
      });
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
  };

  const addComment = (taskId: string, text: string) => {
    const newComment: Comment = {
      id: generateId(),
      text,
      taskId,
      createdAt: new Date().toISOString(),
      user: {
        name: "Current User",
        avatar: "",
      },
    };

    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: [...task.comments, newComment],
            };
          }
          return task;
        }),
      })),
    }));

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: [...task.comments, newComment],
            };
          }
          return task;
        }),
      }));
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Comment added");
  };

  const deleteComment = (commentId: string, taskId: string) => {
    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: task.comments.filter((c) => c.id !== commentId),
            };
          }
          return task;
        }),
      })),
    }));

    setBoards(updatedBoards);

    if (activeBoard) {
      const updatedColumns = activeBoard.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: task.comments.filter((c) => c.id !== commentId),
            };
          }
          return task;
        }),
      }));
      setActiveBoardState({ ...activeBoard, columns: updatedColumns });
    }
    toast.success("Comment deleted");
  };

  const getShareableLink = (boardId: string) => {
    const origin = window.location.origin;
    return `${origin}/board/${boardId}`;
  };

  return (
    <KanbanContext.Provider
      value={{
        boards,
        activeBoard,
        createBoard,
        setActiveBoard,
        updateBoard,
        deleteBoard,
        createColumn,
        updateColumn,
        deleteColumn,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        addComment,
        deleteComment,
        getShareableLink,
        setBoards,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};
