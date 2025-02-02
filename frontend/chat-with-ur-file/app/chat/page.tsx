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

  const onSendMessage = async (message)=>{

    const newHistory = {
      ...chatHistory,
      messages: [...chatHistory.messages, {
        content: message,
        owner:"user"
      }]
    };
    const history_temp= chatHistory;
    saveChatHistory(newHistory);

    try {
      const response = await fetch('/api/chat', {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history:history_temp,newMessage:message }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
  
      // Add model response
      const modelMessageHistory = {
        ...newHistory,
        messages: [
          ...newHistory.messages,
          {
            content: data.response, // Adjust based on your API response 
            owner: "model",
          }
        ]
      };
      saveChatHistory(modelMessageHistory);
      } catch(error){

        console.error('Error sending message:', error);
    // Add error message
    const errorMessageHistory = {
      ...newHistory,
      messages: [
        ...newHistory.messages,
        {
          content: "Sorry, I couldn't process your request",
          owner: "model",
        }
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