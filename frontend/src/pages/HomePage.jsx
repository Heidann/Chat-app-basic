import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200 pt-16 ">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-full h-full p-3">
        <div className="flex h-full rounded-lg overflow-hidden">
          <Sidebar />

          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
