'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function FileUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("selecting file")
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type before setting state
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      alert('Only PDF files are allowed');
      return;
    }

    setSelectedFile(file);
    onUpload(file);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  };

  return (
    <div className="flex flex-col justify-between">

    <div className="header px-10 pb-10 pt-10 flex flex-col">
      <h1 className="text-[#3369FF] text-4xl self-start">GeezLink</h1>
      <div className="self-end pr-3">
      <button className="py-3 text-[#ABAAAA] font-bold">English</button>
      </div>
      
      <hr ></hr>
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
          />

<span className="text-gray-500 text-sm truncate">
            {selectedFile 
              ? selectedFile.name
              : 'Upload a file to get started'
            }
          </span>

          <button
            type="button"
            className={`p-2 rounded-full transition-colors ${
              
              'bg-blue-600 text-white hover:bg-blue-700'
               
            }`}
            onClick={selectedFile ? () => onUpload(selectedFile) : triggerFileInput}
          >
            {selectedFile ? (
              'Send'
            ) : (
              <PlusIcon className="h-6 w-6" />
            )}
          </button>
      
    </div>


    
    </div>

    </div>
  );
}