
import React, { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKanban } from "@/contexts/KanbanContext";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EmptyState: React.FC = () => {
  const { createBoard } = useKanban();
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle);
      setNewBoardTitle("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-kanban-dark text-white p-6">
      <div className="text-center max-w-md glass p-8 rounded-xl">
        <FolderKanban className="h-16 w-16 mx-auto mb-4 text-kanban-highlight" />
        <h1 className="text-2xl font-bold mb-2 text-gradient">Welcome to Kanban Flow</h1>
        <p className="text-gray-400 mb-6">
          Create your first board to start organizing your tasks and projects.
        </p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-kanban-highlight hover:bg-kanban-accent text-black">
              <Plus className="h-5 w-5 mr-2" /> Create Your First Board
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Create New Board</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Title
                </Label>
                <Input
                  id="name"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="col-span-3 bg-muted border-muted text-white"
                  placeholder="Enter board title"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateBoard} className="bg-kanban-highlight text-black hover:bg-kanban-accent">
                Create Board
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmptyState;
