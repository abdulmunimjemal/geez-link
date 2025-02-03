'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function ChatInterface({
  history,
  onSendMessage,
  onClearHistory
}: {
  history: any;
  onSendMessage: (message: string) => void;
  onClearHistory: () => void;
}) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history.messages]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (inputMessage.trim()) {
      setIsLoading(true);
      try {
        await onSendMessage(inputMessage);
        setInputMessage('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearSession = async ()=>{
    // send a request to the backend to clear the session
    // http://localhost:8000/api/sessions/f642853b-9f2d-42ad-bd22-f8119dc35edc
    // by getting the session id from the usechatSessionHook 
    // calls OnclearSessionMethod from the parent 
  }


  return (
    <div className="flex flex-col justify-between">
    <div className="header px-10 pb-10 pt-10 flex flex-col">
    <h1 className="text-[#3369FF] text-4xl self-start">GeezLink</h1>
    <hr ></hr>
    <div className="flex flex-col h-screen max-w-screen-lg min-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold">{history.file.name}</h2>
            <p className="text-sm text-gray-500">{history.file.type.split('/')[1].toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={handleClearSession}
          className="flex items-center text-red-600 hover:text-red-700 text-sm px-5"
        >
          <TrashIcon className="h-5 w-5 mx-1" />
          Clear History
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {history.messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${message.owner === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-4xl p-4  ${
                message.owner === 'user'
                  ? 'bg-blue-600 text-white rounded-tl-[1vw] rounded-bl-[1vw]  rounded-br-lg'
                  : 'bg-gray-100 text-gray-900 border rounded-tl-[1vw] rounded-tr-[1vw]  rounded-br-lg border-gray-200'
              }`}
            >
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
          {/* Input Area with Loading State */}
          <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <PaperAirplaneIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>

    </div>
    </div>

</div>
  );
}