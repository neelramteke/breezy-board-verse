
import React from "react";
import Header from "@/components/Header";
import BoardContainer from "@/components/BoardContainer";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-kanban-dark">
      <Header />
      <BoardContainer />
    </div>
  );
};

export default Dashboard;
