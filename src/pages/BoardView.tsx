
import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import BoardContainer from "@/components/BoardContainer";
import { useKanban } from "@/contexts/KanbanContext";

const BoardView: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, setActiveBoard } = useKanban();

  useEffect(() => {
    if (boardId) {
      setActiveBoard(boardId);
    }
  }, [boardId, setActiveBoard]);

  // Check if board exists
  if (boardId && !boards.some((board) => board.id === boardId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-kanban-dark">
      <Header />
      <BoardContainer />
    </div>
  );
};

export default BoardView;
