'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatSession } from "../hooks/useChatSession";
import FileUpload from "../components/fileUpload"
import ChatInterface from "../components/chatInterface";


export default function ChatPage() { // Changed component name
  const router = useRouter();
  const { chatHistory, saveChatHistory, clearChatHistory,sessionId } = useChatSession();
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

  const onSendMessage = async (message)=>{


    if (!sessionId?.id) {
      const errorHistory = {
        ...chatHistory,
        messages: [
          ...chatHistory.messages,
          { content: message, owner: "user" },
          { content: "Session expired. Please start a new chat.", owner: "model" }
        ]
      };
      saveChatHistory(errorHistory);
      return;
    }

        // Add user message immediately
        const userMessageHistory = {
          ...chatHistory,
          messages: [
            ...chatHistory.messages, 
            { content: message, owner: "user" }
          ]
        };
        saveChatHistory(userMessageHistory);


        try {
          const encodedQuestion = encodeURIComponent(message);
          const response = await fetch(
            `http://localhost:8000/api/chat?session_id=${sessionId.id}&question=${encodedQuestion}`,
            { method: 'POST',
              headers: {
                "Content-Type": "application/json",
              }, 

            }
          );
    
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
          const data = await response.json();
    
          // Add model response
          const modelMessageHistory = {
            ...userMessageHistory,
            messages: [
              ...userMessageHistory.messages,
              { content: data.answer, owner: "model" }
            ]
          };
          saveChatHistory(modelMessageHistory);
    
        } catch (error) {
          console.error('API Error:', error);
          const errorMessageHistory = {
            ...userMessageHistory,
            messages: [
              ...userMessageHistory.messages,
              { content: "Sorry, there was an error processing your request", owner: "model" }
            ]
          };
          saveChatHistory(errorMessageHistory);
        }

      
    
    }
  


    
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
          onSendMessage={onSendMessage}
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