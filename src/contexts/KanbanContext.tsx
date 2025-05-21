
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Board, Column, Task, Comment } from "../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface KanbanContextType {
  boards: Board[];
  activeBoard: Board | null;
  createBoard: (title: string) => Promise<void>;
  setActiveBoard: (boardId: string) => void;
  updateBoard: (boardId: string, title: string) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  createColumn: (title: string, boardId: string) => Promise<void>;
  updateColumn: (columnId: string, title: string) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  createTask: (columnId: string, boardId: string, title: string, description: string, priority?: string, tags?: string[]) => Promise<void>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string, taskId: string) => Promise<void>;
  getShareableLink: (boardId: string) => string;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  isLoading: boolean;
  toggleBoardVisibility: (boardId: string, isPublic: boolean) => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoardState] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Load boards from Supabase
  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      try {
        const { data: boardsData, error: boardsError } = await supabase
          .from('boards')
          .select('*');

        if (boardsError) throw boardsError;

        const loadedBoards: Board[] = [];

        for (const boardData of boardsData || []) {
          const { data: columnsData, error: columnsError } = await supabase
            .from('columns')
            .select('*')
            .eq('board_id', boardData.id)
            .order('position', { ascending: true });

          if (columnsError) throw columnsError;

          const columns: Column[] = [];

          for (const columnData of columnsData || []) {
            const { data: tasksData, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .eq('column_id', columnData.id);

            if (tasksError) throw tasksError;

            const tasks: Task[] = [];

            for (const taskData of tasksData || []) {
              const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .eq('task_id', taskData.id)
                .order('created_at', { ascending: false });

              if (commentsError) throw commentsError;

              const comments: Comment[] = commentsData?.map(comment => ({
                id: comment.id,
                text: comment.text,
                taskId: comment.task_id,
                createdAt: comment.created_at,
                user: {
                  name: comment.user_name,
                  avatar: ''
                }
              })) || [];

              tasks.push({
                id: taskData.id,
                title: taskData.title,
                description: taskData.description || '',
                columnId: taskData.column_id,
                boardId: taskData.board_id,
                comments: comments,
                priority: taskData.priority || 'medium',
                tags: taskData.tags || []
              });
            }

            columns.push({
              id: columnData.id,
              title: columnData.title,
              boardId: columnData.board_id,
              tasks: tasks
            });
          }

          loadedBoards.push({
            id: boardData.id,
            title: boardData.title,
            columns: columns,
            isPublic: boardData.is_public
          });
        }

        setBoards(loadedBoards);
        
        // Set first board as active if there is one
        if (loadedBoards.length > 0 && !activeBoard) {
          setActiveBoardState(loadedBoards[0]);
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
        toast.error('Failed to load boards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const setActiveBoard = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId) || null;
    setActiveBoardState(board);
  };

  const createBoard = async (title: string) => {
    try {
      // Insert new board to the database
      const { data: newBoardData, error: newBoardError } = await supabase
        .from('boards')
        .insert([{ title }])
        .select()
        .single();

      if (newBoardError) throw newBoardError;

      // Create default columns
      const defaultColumns = [
        { title: 'To Do', board_id: newBoardData.id, position: 0 },
        { title: 'In Progress', board_id: newBoardData.id, position: 1 },
        { title: 'Done', board_id: newBoardData.id, position: 2 },
      ];

      const { data: columnsData, error: columnsError } = await supabase
        .from('columns')
        .insert(defaultColumns)
        .select();

      if (columnsError) throw columnsError;
      
      // Build the new board with its columns
      const newBoard: Board = {
        id: newBoardData.id,
        title: newBoardData.title,
        columns: columnsData.map(col => ({
          id: col.id,
          title: col.title,
          boardId: col.board_id,
          tasks: []
        })),
        isPublic: newBoardData.is_public || false
      };

      setBoards([...boards, newBoard]);
      setActiveBoardState(newBoard);
      navigate(`/board/${newBoard.id}`);
      toast.success("Board created successfully");
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error("Failed to create board");
    }
  };

  const updateBoard = async (boardId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .update({ title })
        .eq('id', boardId);

      if (error) throw error;

      const updatedBoards = boards.map((board) =>
        board.id === boardId ? { ...board, title } : board
      );
      
      setBoards(updatedBoards);

      if (activeBoard?.id === boardId) {
        setActiveBoardState({ ...activeBoard, title });
      }
      
      toast.success("Board updated successfully");
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error("Failed to update board");
    }
  };

  const deleteBoard = async (boardId: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId);

      if (error) throw error;

      const updatedBoards = boards.filter((board) => board.id !== boardId);
      setBoards(updatedBoards);

      if (activeBoard?.id === boardId) {
        setActiveBoardState(updatedBoards[0] || null);
        navigate('/');
      }
      
      toast.success("Board deleted successfully");
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error("Failed to delete board");
    }
  };

  const createColumn = async (title: string, boardId: string) => {
    try {
      // Get highest position
      const boardColumns = boards.find(b => b.id === boardId)?.columns || [];
      const highestPosition = boardColumns.length;
      
      const { data: newColumn, error } = await supabase
        .from('columns')
        .insert([{ 
          title, 
          board_id: boardId,
          position: highestPosition
        }])
        .select()
        .single();

      if (error) throw error;

      const newColumnObj: Column = {
        id: newColumn.id,
        title: newColumn.title,
        boardId: newColumn.board_id,
        tasks: []
      };

      const updatedBoards = boards.map((board) =>
        board.id === boardId
          ? { ...board, columns: [...board.columns, newColumnObj] }
          : board
      );

      setBoards(updatedBoards);

      if (activeBoard?.id === boardId) {
        setActiveBoardState({
          ...activeBoard,
          columns: [...activeBoard.columns, newColumnObj],
        });
      }
      
      toast.success("Column created successfully");
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error("Failed to create column");
    }
  };

  const updateColumn = async (columnId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('columns')
        .update({ title })
        .eq('id', columnId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error updating column:', error);
      toast.error("Failed to update column");
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error("Failed to delete column");
    }
  };

  const createTask = async (
    columnId: string,
    boardId: string,
    title: string,
    description: string,
    priority: string = 'medium',
    tags: string[] = []
  ) => {
    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert([{ 
          title, 
          description, 
          column_id: columnId, 
          board_id: boardId,
          priority,
          tags 
        }])
        .select()
        .single();

      if (error) throw error;

      const newTaskObj: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || '',
        columnId: newTask.column_id,
        boardId: newTask.board_id,
        comments: [],
        priority: newTask.priority || 'medium',
        tags: newTask.tags || []
      };

      const updatedBoards = boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            columns: board.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  tasks: [...column.tasks, newTaskObj],
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
              tasks: [...column.tasks, newTaskObj],
            };
          }
          return column;
        });
        setActiveBoardState({ ...activeBoard, columns: updatedColumns });
      }
      
      toast.success("Task created successfully");
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task");
    }
  };

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      const updateData: Record<string, any> = {};
      
      // Map Task fields to database columns
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.columnId !== undefined) updateData.column_id = data.columnId;
      
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
    }
  };

  const moveTask = async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string
  ) => {
    try {
      // Update task's column in the database
      const { error } = await supabase
        .from('tasks')
        .update({ column_id: destinationColumnId })
        .eq('id', taskId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error("Failed to move task");
    }
  };

  const addComment = async (taskId: string, text: string) => {
    try {
      // Default user name for now - would be replaced by actual user name in authentication system
      const userName = "Current User";
      
      const { data: newComment, error } = await supabase
        .from('comments')
        .insert([{ 
          task_id: taskId,
          text,
          user_name: userName
        }])
        .select()
        .single();

      if (error) throw error;

      const commentObj: Comment = {
        id: newComment.id,
        text: newComment.text,
        taskId: newComment.task_id,
        createdAt: newComment.created_at,
        user: {
          name: newComment.user_name,
          avatar: ''
        }
      };

      const updatedBoards = boards.map((board) => ({
        ...board,
        columns: board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                comments: [commentObj, ...task.comments],
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
                comments: [commentObj, ...task.comments],
              };
            }
            return task;
          }),
        }));
        setActiveBoardState({ ...activeBoard, columns: updatedColumns });
      }
      
      toast.success("Comment added");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    }
  };

  const deleteComment = async (commentId: string, taskId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  const toggleBoardVisibility = async (boardId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('boards')
        .update({ is_public: isPublic })
        .eq('id', boardId);
      
      if (error) throw error;
      
      const updatedBoards = boards.map(board => 
        board.id === boardId ? { ...board, isPublic } : board
      );
      
      setBoards(updatedBoards);
      
      if (activeBoard?.id === boardId) {
        setActiveBoardState({ ...activeBoard, isPublic });
      }
      
      toast.success(isPublic ? "Board is now public" : "Board is now private");
    } catch (error) {
      console.error('Error updating board visibility:', error);
      toast.error("Failed to update board visibility");
    }
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
        isLoading,
        toggleBoardVisibility,
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
