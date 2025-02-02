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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
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
          onClick={onClearHistory}
          className="flex items-center text-red-600 hover:text-red-700 text-sm"
        >
          <TrashIcon className="h-5 w-5 mr-1" />
          Clear History
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {history.messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${message.user === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md p-4 rounded-lg ${
                message.user === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.user === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
}