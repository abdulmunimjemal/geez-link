'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatSession } from "../hooks/useChatSession";
import FileUpload from "../components/fileUpload"
import ChatInterface from "../components/chatInterface";


export default function ChatPage() { // Changed component name
  const router = useRouter();
  const { chatHistory, saveChatHistory, clearChatHistory } = useChatSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleFileUpload = (file: File) => {
    // Add file validation
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      alert('Invalid file type');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      saveChatHistory({
        file: {
          name: file.name,
          type: file.type,
          content: reader.result as string,
        },
        messages: []
      });
    };
    reader.readAsDataURL(file);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {chatHistory?.file ? (
        <ChatInterface
          history={chatHistory}
          onSendMessage={(message) => {
            const newHistory = {
              ...chatHistory,
              messages: [...chatHistory.messages, {
                content: message,
              }]
            };
            saveChatHistory(newHistory);
          }}
          onClearHistory={() => {
            clearChatHistory();
            router.push('/welcome');
          }}
        />
      ) : (
        <div className="mx-auto p-4">
          <FileUpload onUpload={handleFileUpload} />
        </div>
      )}
    </div>
  );
}