
import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import { useKanban } from "../contexts/KanbanContext";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useKanban();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [newComment, setNewComment] = useState("");
  const { addComment, deleteComment } = useKanban();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 1000,
      }
    : undefined;

  const handleEditTask = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle, description: editDescription });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, newComment);
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId, task.id);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={() => setIsViewDialogOpen(true)}
        className="bg-kanban-card glass p-3 rounded-md shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group animate-fade-in"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-white font-medium text-sm">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-popover border-muted text-white">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTitle(task.title);
                  setEditDescription(task.description);
                  setIsEditDialogOpen(true);
                }}
                className="cursor-pointer hover:bg-muted"
              >
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-muted" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask();
                }}
                className="text-destructive cursor-pointer hover:bg-muted"
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && (
          <p className="text-gray-400 text-xs mt-2 line-clamp-2">{task.description}</p>
        )}
        {task.comments.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center text-xs text-gray-400">
            <MessageSquare className="h-3 w-3 mr-1" />
            {task.comments.length} {task.comments.length === 1 ? "comment" : "comments"}
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-kanban-dark border-muted text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title-edit">Title</Label>
              <Input
                id="task-title-edit"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-muted border-muted text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description-edit">Description</Label>
              <Textarea
                id="task-description-edit"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-muted border-muted text-white min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditTask}
              className="bg-kanban-highlight text-black hover:bg-kanban-accent"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px] md:max-w-[650px] bg-kanban-dark border-muted text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{task.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {task.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Label className="text-sm font-semibold mb-2 block">Comments</Label>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                {task.comments.length === 0 ? (
                  <p className="text-gray-400 text-sm">No comments yet</p>
                ) : (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="glass p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-accent/20 text-white text-xs">
                              {comment.user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{comment.user.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/20"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-400 hover:text-destructive"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-200">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator className="my-4 bg-muted" />

            <div className="flex flex-col space-y-2">
              <Label htmlFor="new-comment">Add a comment</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="new-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-muted border-muted text-white min-h-[80px] resize-none"
                />
              </div>
              <Button
                onClick={handleAddComment}
                className="bg-kanban-highlight text-black hover:bg-kanban-accent self-end"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
