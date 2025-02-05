'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useChatSession } from '../hooks/useChatSession';

export default function FileUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { sessionId } = useChatSession();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      alert('Only PDF files are allowed');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!sessionId?.id) {
      setErrorMessage('No active session found');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(
        `http://localhost:8000/api/chat/upload?session_id=${sessionId.id}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        setErrorMessage(`Upload failed: ${response.statusText}`);
      }

      // If upload is successful, update parent component
      onUpload(selectedFile);
      
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'File upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="header px-10 pb-10 pt-10 flex flex-col">
        <h1 className="text-[#3369FF] text-4xl self-start">GeezLink</h1>
        <div className="self-end pr-3">
          <button className="py-3 text-[#ABAAAA] font-bold">English</button>
        </div>
        <hr />
      </div>

      <div className="flex justify-center items-center mt-5 md:mt-10 lg:mt-16">
        <p className="text-[#3369FF] text-2xl font-extrabold">How can I help you with?</p>
      </div>

      <div className="mx-auto mt-10 w-full max-w-2xl px-4">
        <div className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg shadow-sm bg-white">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
          />

          <span className="text-gray-500 text-sm truncate">
            {selectedFile?.name || 'Upload a file to get started'}
          </span>

          <button
            type="button"
            className={`p-2 rounded-full transition-colors ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={selectedFile ? handleUpload : () => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : selectedFile ? (
              'Send'
            ) : (
              <PlusIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}