import React, { useState } from "react";
import { useKanban } from "@/contexts/KanbanContext";
import KanbanColumn from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Edit, Globe, Lock } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const KanbanBoard: React.FC = () => {
  const { activeBoard, createColumn, getShareableLink, updateBoard, toggleBoardVisibility } = useKanban();
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateColumn = () => {
    if (newColumnTitle.trim() && activeBoard) {
      createColumn(newColumnTitle, activeBoard.id);
      setNewColumnTitle("");
      setIsAddColumnDialogOpen(false);
    }
  };

  const copyShareableLink = () => {
    if (!activeBoard) return;
    
    const link = getShareableLink(activeBoard.id);
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleRenameBoard = () => {
    if (boardTitle.trim() && activeBoard) {
      updateBoard(activeBoard.id, boardTitle);
      setIsRenameDialogOpen(false);
    }
  };

  if (!activeBoard) {
    return <div className="flex justify-center items-center h-full">No board selected</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">{activeBoard.title}</h1>
          <Button
            variant="ghost"
            className="ml-2 p-0 h-8 w-8"
            onClick={() => {
              setBoardTitle(activeBoard.title);
              setIsRenameDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-white" />
          </Button>
          
          <div className="ml-4 flex items-center">
            {activeBoard.isPublic ? (
              <Badge variant="secondary" className="flex items-center gap-1 ml-2">
                <Globe className="h-3 w-3" />
                <span>Public</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 ml-2">
                <Lock className="h-3 w-3" />
                <span>Private</span>
              </Badge>
            )}
          </div>
        </div>
        
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

          <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
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
                <div className="grid gap-2">
                  <Label htmlFor="column-title">Title</Label>
                  <Input
                    id="column-title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="bg-muted border-muted text-white"
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
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="public-board"
                    checked={activeBoard.isPublic}
                    onCheckedChange={(checked) => {
                      if (activeBoard) toggleBoardVisibility(activeBoard.id, checked);
                    }}
                  />
                  <Label htmlFor="public-board">Make board public</Label>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">
                  {activeBoard.isPublic 
                    ? "Anyone with this link can view this board:" 
                    : "Only you can see this board. Make it public to share with others:"}
                </p>
                
                <div className="flex space-x-2">
                  <Input
                    readOnly
                    value={activeBoard ? getShareableLink(activeBoard.id) : ""}
                    className="flex-1 bg-muted border-muted text-white"
                  />
                  <Button 
                    onClick={copyShareableLink}
                    className="bg-kanban-highlight text-black hover:bg-kanban-accent"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                
                {!activeBoard.isPublic && (
                  <p className="text-amber-400 text-sm mt-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    This board is private. Enable "Make board public" to share with others.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Rename Board</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="board-title">Title</Label>
                  <Input
                    id="board-title"
                    value={boardTitle}
                    onChange={(e) => setBoardTitle(e.target.value)}
                    className="bg-muted border-muted text-white"
                    placeholder="Enter board title"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleRenameBoard}
                  className="bg-kanban-highlight text-black hover:bg-kanban-accent"
                >
                  Rename Board
                </Button>
              </DialogFooter>
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
