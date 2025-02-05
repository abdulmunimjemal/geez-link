'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useChatSession } from "../hooks/useChatSession";
import { useRouter } from "next/navigation";

const WelcomePage = () => {

  const {saveSession} = useChatSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        alert('Failed to create session');
      }

      const sessionData = await response.json();
      
      // Save session to storage
      saveSession({ id: sessionData.session_id });
      
      // Navigate to chat page
      router.push('/chat');
    } catch (err) {
      console.error('Session creation error:', err);
      alert('Failed to start chat session. Please try again.');
      setError('Failed to start chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  
  return (

    <div>

      <div className="flex flex-col items-center w-72 mx-auto mt-8">
        <h1 className="font-serif text-xl mb-3">Chat with your file</h1>
        <p className="text-center mb-8">
          Using this software, you can ask your questions and receive answers
          using an artificial intelligence assistant that uses a vector
          embedding model.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <Image src="/images/Frame.png" alt="logo" width={300} height={200} />
      </div>

      <div className="flex flex-col items-center gap-4 mt-6 mb-20">
        <button 
          onClick={handleContinue}
          disabled={isLoading}
          className="flex justify-between bg-blue-600 text-white p-4 rounded-xl w-64 disabled:opacity-50"
        >
          {isLoading ? (
            'Creating Session...'
          ) : (
            <>
              <p className="text-center ml-14">Continue</p>
              <Image 
                src="/images/arrow-right.png" 
                alt="arrow" 
                width={20} 
                height={20} 
                className="flex justify-end"
              />
            </>
          )}
        </button>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

    </div>
  );
};

export default WelcomePage;