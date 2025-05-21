
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams, Navigate } from "react-router-dom";
import { useKanban } from "@/contexts/KanbanContext";
import KanbanBoard from "@/components/KanbanBoard";
import EmptyState from "@/components/EmptyState";

const BoardContainer: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, setActiveBoard, activeBoard } = useKanban();
  
  // If there's a boardId param, set it as active
  React.useEffect(() => {
    if (boardId) {
      setActiveBoard(boardId);
    } else if (boards.length > 0 && !activeBoard) {
      // If there's no active board but we have boards, set the first one as active
      setActiveBoard(boards[0].id);
    }
  }, [boardId, boards, setActiveBoard, activeBoard]);
  
  // If there's no active board and we have a boardId param, check if it exists
  if (boardId && !boards.some(board => board.id === boardId)) {
    return <Navigate to="/" replace />;
  }
  
  if (!activeBoard && boards.length > 0) {
    // If we have boards but no active board, navigate to the first one
    return <Navigate to={`/board/${boards[0].id}`} replace />;
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-hidden">
        {activeBoard ? (
          <KanbanBoard />
        ) : (
          <EmptyState />
        )}
      </div>
    </DndProvider>
  );
};

export default BoardContainer;
