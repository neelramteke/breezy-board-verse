
import React from "react";
import { useKanban } from "@/contexts/KanbanContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, Share2, Lock, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage: React.FC = () => {
  const { boards, createBoard, deleteBoard, updateBoard, toggleBoardVisibility, isLoading } = useKanban();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false);
  const [newBoardTitle, setNewBoardTitle] = React.useState("");
  const [selectedBoard, setSelectedBoard] = React.useState<string | null>(null);
  const [boardToRename, setBoardToRename] = React.useState<{ id: string; title: string } | null>(null);

  const handleCreateBoard = async () => {
    if (newBoardTitle.trim()) {
      await createBoard(newBoardTitle);
      setNewBoardTitle("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleRenameBoard = async () => {
    if (boardToRename && boardToRename.title.trim()) {
      await updateBoard(boardToRename.id, boardToRename.title);
      setIsRenameDialogOpen(false);
      setBoardToRename(null);
    }
  };

  const openRenameDialog = (board: { id: string; title: string }) => {
    setBoardToRename(board);
    setIsRenameDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-kanban-dark">
      <Header />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">My Boards</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-kanban-highlight hover:bg-kanban-accent text-black"
            >
              <Plus className="h-4 w-4 mr-1" /> New Board
            </Button>
            <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Create New Board</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="board-title">Title</Label>
                  <Input
                    id="board-title"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    className="bg-muted border-muted text-white"
                    placeholder="Enter board title"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateBoard}
                  className="bg-kanban-highlight text-black hover:bg-kanban-accent"
                >
                  Create Board
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-kanban-column border-muted">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-muted" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-full bg-muted" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 border border-dashed border-muted rounded-lg">
            <FolderKanban className="text-muted-foreground h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No boards yet</h2>
            <p className="text-muted-foreground mb-4">Create your first Kanban board to get started</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-kanban-highlight hover:bg-kanban-accent text-black"
            >
              <Plus className="h-4 w-4 mr-1" /> Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <Card key={board.id} className="bg-kanban-column border-muted overflow-hidden group hover:border-muted-foreground transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-xl truncate max-w-[80%]">{board.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-white"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-popover border-muted text-white">
                        <DropdownMenuItem 
                          onClick={() => openRenameDialog({ id: board.id, title: board.title })}
                          className="cursor-pointer hover:bg-muted"
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => toggleBoardVisibility(board.id, !board.isPublic)}
                          className="cursor-pointer hover:bg-muted"
                        >
                          {board.isPublic ? "Make Private" : "Make Public"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteBoard(board.id)}
                          className="text-destructive cursor-pointer hover:bg-muted"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {board.columns.length} columns, {board.columns.reduce((acc, col) => acc + col.tasks.length, 0)} tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex gap-2 flex-wrap">
                    {board.columns.slice(0, 3).map((column) => (
                      <div key={column.id} className="px-2 py-1 bg-muted/30 rounded text-xs text-muted-foreground">
                        {column.title}: {column.tasks.length}
                      </div>
                    ))}
                    {board.columns.length > 3 && (
                      <div className="px-2 py-1 bg-muted/30 rounded text-xs text-muted-foreground">
                        +{board.columns.length - 3} more
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-1 pb-3 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-white"
                    onClick={() => {
                      const url = `/board/${board.id}`;
                      navigator.clipboard.writeText(window.location.origin + url);
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  
                  <div className="flex items-center text-xs font-medium">
                    {board.isPublic ? (
                      <div className="flex items-center text-green-400">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </div>
                    )}
                  </div>
                  
                  <Button asChild size="sm" className="bg-kanban-highlight hover:bg-kanban-accent text-black">
                    <Link to={`/board/${board.id}`}>Open</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Rename Board</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="board-rename-title">Title</Label>
              <Input
                id="board-rename-title"
                value={boardToRename?.title || ""}
                onChange={(e) => setBoardToRename(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="bg-muted border-muted text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleRenameBoard}
              className="bg-kanban-highlight text-black hover:bg-kanban-accent"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
