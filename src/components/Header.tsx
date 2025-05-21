import React from "react";
import { FolderKanban } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const isSharedBoard = location.pathname.startsWith('/board/') && new URLSearchParams(location.search).get('shared') === 'true';
  
  return (
    <header className="bg-kanban-darker/30 backdrop-blur-md border-b border-white/10 py-4 px-6 text-white flex justify-between items-center shadow-md z-10">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <FolderKanban className="h-6 w-6 text-kanban-highlight" />
          <span className="text-xl font-semibold text-gradient">Kanban Flow</span>
        </Link>
      </div>

      {!isSharedBoard && location.pathname !== '/' && (
        <Link 
          to="/"
          className="text-md font-medium hover:bg-white/5 focus:bg-white/5 px-4 py-2 rounded-md transition-colors"
        >
          Dashboard
        </Link>
      )}
    </header>
  );
};

export default Header;