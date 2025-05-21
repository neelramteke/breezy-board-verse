
import React, { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKanban } from "@/contexts/KanbanContext";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { activeBoard, boards, createBoard, setActiveBoard } = useKanban();
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle);
      setNewBoardTitle("");
      setIsDialogOpen(false);
    }
  };

  return (
    <header className="bg-kanban-darker py-4 px-6 text-white flex justify-between items-center shadow-md z-10">
      <div className="flex items-center space-x-2">
        <FolderKanban className="h-6 w-6 text-kanban-highlight" />
        <span className="text-xl font-semibold text-gradient">Kanban Flow</span>
      </div>

      <div className="flex items-center space-x-4">
        {boards.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              className="text-md font-medium hover:bg-white/5 focus:bg-white/5"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {activeBoard?.title || "Select Board"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {boards.map((board) => (
                    <Link
                      key={board.id}
                      to={`/board/${board.id}`}
                      className="px-4 py-2 text-sm flex items-center hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setActiveBoard(board.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FolderKanban className="h-4 w-4 mr-2" />
                      {board.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-kanban-highlight hover:bg-kanban-accent text-black">
              <Plus className="h-4 w-4 mr-1" /> New Board
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
    </header>
  );
};

export default Header;
