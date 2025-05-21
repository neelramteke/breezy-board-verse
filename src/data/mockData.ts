
import { Board } from "../types";
import { v4 as uuidv4 } from "uuid";

export const mockBoards: Board[] = [
  {
    id: "board-1",
    title: "Project Alpha",
    columns: [
      {
        id: "column-1",
        title: "To Do",
        boardId: "board-1",
        tasks: [
          {
            id: "task-1",
            title: "Research competitors",
            description: "Analyze top 5 competitor products and create a comparison matrix",
            columnId: "column-1",
            boardId: "board-1",
            comments: [
              {
                id: "comment-1",
                text: "Let's focus on pricing and features",
                taskId: "task-1",
                createdAt: "2023-04-10T12:00:00Z",
                user: {
                  name: "Jane Smith",
                  avatar: "",
                },
              },
            ],
          },
          {
            id: "task-2",
            title: "Create wireframes",
            description: "Design initial wireframes for the landing page",
            columnId: "column-1",
            boardId: "board-1",
            comments: [],
          },
        ],
      },
      {
        id: "column-2",
        title: "In Progress",
        boardId: "board-1",
        tasks: [
          {
            id: "task-3",
            title: "Implement authentication",
            description: "Set up user login and registration with Supabase",
            columnId: "column-2",
            boardId: "board-1",
            comments: [
              {
                id: "comment-2",
                text: "Let's add social login options too",
                taskId: "task-3",
                createdAt: "2023-04-11T10:30:00Z",
                user: {
                  name: "Mike Johnson",
                  avatar: "",
                },
              },
            ],
          },
        ],
      },
      {
        id: "column-3",
        title: "Review",
        boardId: "board-1",
        tasks: [],
      },
      {
        id: "column-4",
        title: "Done",
        boardId: "board-1",
        tasks: [
          {
            id: "task-4",
            title: "Project setup",
            description: "Initialize project with React and Tailwind CSS",
            columnId: "column-4",
            boardId: "board-1",
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: "board-2",
    title: "Marketing Campaign",
    columns: [
      {
        id: "column-5",
        title: "Ideas",
        boardId: "board-2",
        tasks: [
          {
            id: "task-5",
            title: "Social media strategy",
            description: "Create a content plan for Q2",
            columnId: "column-5",
            boardId: "board-2",
            comments: [],
          },
        ],
      },
      {
        id: "column-6",
        title: "To Do",
        boardId: "board-2",
        tasks: [],
      },
      {
        id: "column-7",
        title: "In Progress",
        boardId: "board-2",
        tasks: [],
      },
      {
        id: "column-8",
        title: "Completed",
        boardId: "board-2",
        tasks: [],
      },
    ],
  },
];

export const generateId = () => uuidv4();
