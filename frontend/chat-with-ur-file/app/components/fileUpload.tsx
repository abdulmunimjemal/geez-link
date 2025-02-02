'use client';

import { useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

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


    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf"
        onChange={handleFileSelect}
        key={selectedFile?.name} // Force re-render on file selection
      />
      
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block"
      >
        <div className="flex flex-col items-center space-y-4">
          <DocumentArrowUpIcon className="h-12 w-12 text-blue-600" />
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {selectedFile ? 'File Selected' : 'Select a File'}
            </p>
            <p className="text-sm text-gray-500">
              {selectedFile 
                ? `${selectedFile.name} (${selectedFile.type.split('/')[1].toUpperCase()})`
                : 'PDF or TXT files only'
              }
            </p>
          </div>
          
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            // Add aria-label for accessibility
            aria-label={selectedFile ? 'Change selected file' : 'Choose file'}
            onClick={triggerFileInput}
          >
            {selectedFile ? 'Change File' : 'Choose File'}
          </button>
        </div>
      </label>
    </div>
  );
}