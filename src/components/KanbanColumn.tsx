
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Column } from "../types";
import { useKanban } from "../contexts/KanbanContext";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, AlertTriangle, Tag } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { createTask, updateColumn, deleteColumn, activeBoard } = useKanban();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false);
  const [editColumnTitle, setEditColumnTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleCreateTask = () => {
    if (newTaskTitle.trim() && activeBoard) {
      createTask(column.id, activeBoard.id, newTaskTitle, newTaskDescription, newTaskPriority, tags);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setTags([]);
      setIsAddTaskDialogOpen(false);
    }
  };

  const handleUpdateColumn = () => {
    if (editColumnTitle.trim()) {
      updateColumn(column.id, editColumnTitle);
      setIsEditColumnDialogOpen(false);
    }
  };

  const handleDeleteColumn = () => {
    deleteColumn(column.id);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-72 flex-shrink-0 flex flex-col rounded-md ${
        isOver ? "ring-2 ring-accent" : ""
      }`}
    >
      <div className="bg-kanban-column rounded-t-md p-3 flex justify-between items-center">
        <h2 className="text-white font-semibold">{column.title}</h2>
        <div className="flex items-center">
          <span className="text-xs bg-muted/60 text-white px-2 py-0.5 rounded-full mr-2">
            {column.tasks.length}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-popover border-muted text-white">
              <DropdownMenuItem
                onClick={() => {
                  setEditColumnTitle(column.title);
                  setIsEditColumnDialogOpen(true);
                }}
                className="cursor-pointer hover:bg-muted"
              >
                Edit Column
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-muted" />
              <DropdownMenuItem
                onClick={handleDeleteColumn}
                className="text-destructive cursor-pointer hover:bg-muted"
              >
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-kanban-column/80 flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin rounded-b-md">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full border border-dashed border-muted hover:border-accent hover:bg-muted/20 text-muted-foreground hover:text-white"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-muted border-muted text-white"
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="bg-muted border-muted text-white min-h-[100px]"
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                  <SelectTrigger className="bg-muted border-muted text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-muted text-white">
                    <SelectItem value="low" className="text-blue-400">Low</SelectItem>
                    <SelectItem value="medium" className="text-yellow-400">Medium</SelectItem>
                    <SelectItem value="high" className="text-red-400">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="bg-muted hover:bg-muted/70 text-white flex items-center gap-1">
                      {tag}
                      <button 
                        type="button"
                        onClick={() => removeTag(tag)} 
                        className="ml-1 text-xs opacity-70 hover:opacity-100"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-muted border-muted text-white flex-1 rounded-r-none"
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addTag} 
                    className="rounded-l-none bg-muted-foreground hover:bg-muted-foreground/80"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateTask}
                className="bg-kanban-highlight text-black hover:bg-kanban-accent"
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditColumnDialogOpen} onOpenChange={setIsEditColumnDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Edit Column</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-title-edit">Title</Label>
              <Input
                id="column-title-edit"
                value={editColumnTitle}
                onChange={(e) => setEditColumnTitle(e.target.value)}
                className="bg-muted border-muted text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateColumn}
              className="bg-kanban-highlight text-black hover:bg-kanban-accent"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanColumn;
