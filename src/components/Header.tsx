
import React from "react";
import { FolderKanban, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useKanban } from "@/contexts/KanbanContext";

const Header: React.FC = () => {
  const { activeBoard } = useKanban();

  return (
    <header className="bg-kanban-darker py-4 px-6 text-white flex justify-between items-center shadow-md z-10">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <FolderKanban className="h-6 w-6 text-kanban-highlight" />
          <span className="text-xl font-semibold text-gradient">Kanban Flow</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" className="text-md font-medium hover:bg-white/5 focus:bg-white/5">
          <Link to="/">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
