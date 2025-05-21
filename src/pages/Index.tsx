
import React, { useRef } from "react";
import { KanbanProvider, useKanban } from "@/contexts/KanbanContext";
import Dashboard from "./Dashboard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

// Create a wrapper component that uses the KanbanContext
const KanbanWrapper: React.FC = () => {
  const kanbanContext = useKanban();
  const { moveTask } = kanbanContext;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    // Make sure we have a valid over element
    if (over && active.id !== over.id) {
      // Extract the task data from the active element
      const taskId = active.id;
      const sourceColumnId = active.data.current.task.columnId;
      const destinationColumnId = over.id;

      // Only move if the column ID is different
      if (sourceColumnId !== destinationColumnId) {
        // Call the moveTask function
        moveTask(taskId, sourceColumnId, destinationColumnId);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <Dashboard />
    </DndContext>
  );
};

const Index: React.FC = () => {
  return (
    <KanbanProvider>
      <KanbanWrapper />
    </KanbanProvider>
  );
};

export default Index;
