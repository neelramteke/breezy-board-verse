
import React, { useState } from "react";
import { useKanban } from "@/contexts/KanbanContext";
import KanbanColumn from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const KanbanBoard: React.FC = () => {
  const { activeBoard, createColumn, getShareableLink } = useKanban();
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleCreateColumn = () => {
    if (newColumnTitle.trim() && activeBoard) {
      createColumn(newColumnTitle, activeBoard.id);
      setNewColumnTitle("");
      setIsDialogOpen(false);
    }
  };

  const copyShareableLink = () => {
    if (!activeBoard) return;
    
    const link = getShareableLink(activeBoard.id);
    navigator.clipboard.writeText(link);
    setIsShareDialogOpen(false);
  };

  if (!activeBoard) {
    return <div className="flex justify-center items-center h-full">No board selected</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-6 py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-white">{activeBoard.title}</h1>
        <div className="flex space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsShareDialogOpen(true)}
                variant="outline"
                className="border-muted hover:bg-muted"
              >
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate a shareable link for this board</p>
            </TooltipContent>
          </Tooltip>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kanban-highlight hover:bg-kanban-accent text-black">
                <Plus className="h-4 w-4 mr-1" /> Add Column
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Add New Column</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="column-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="column-title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="col-span-3 bg-muted border-muted text-white"
                    placeholder="Enter column title"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateColumn}
                  className="bg-kanban-highlight text-black hover:bg-kanban-accent"
                >
                  Create Column
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Share Board</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-400 mb-3">
                  Share this link with others to give them access to this board:
                </p>
                <div className="flex space-x-2">
                  <Input
                    readOnly
                    value={activeBoard ? getShareableLink(activeBoard.id) : ""}
                    className="flex-1 bg-muted border-muted text-white"
                  />
                  <Button onClick={copyShareableLink} className="bg-kanban-highlight text-black hover:bg-kanban-accent">
                    Copy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-1 p-4 space-x-4 overflow-x-auto scrollbar-thin">
        {activeBoard.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
