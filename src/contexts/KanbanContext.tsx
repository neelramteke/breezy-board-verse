// Update the getShareableLink function in KanbanContext.tsx
const getShareableLink = (boardId: string) => {
  const origin = window.location.origin;
  return `${origin}/board/${boardId}?shared=true`;
};