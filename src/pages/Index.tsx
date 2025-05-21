
import React from "react";
import { KanbanProvider } from "@/contexts/KanbanContext";
import Dashboard from "./Dashboard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const Index: React.FC = () => {
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
        kanbanContext.moveTask(taskId, sourceColumnId, destinationColumnId);
      }
    }
  };

  // Create a ref to store the context value
  const kanbanContextRef = React.useRef<any>(null);
  const kanbanContext = kanbanContextRef.current;

  return (
    <KanbanProvider>
      {(contextValue: any) => {
        // Store the context value in the ref
        kanbanContextRef.current = contextValue;
        
        return (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <Dashboard />
          </DndContext>
        );
      }}
    </KanbanProvider>
  );
};

export default Index;
