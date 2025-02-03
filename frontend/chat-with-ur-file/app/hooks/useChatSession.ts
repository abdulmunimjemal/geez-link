'use client';

import { useEffect,useState } from "react";

type chatMessage = {
    content:string;
}

type chatHistory ={
    file? : {
        name:string;
        type:string;
        content:string;
    }

    messages:chatMessage[];
}

type sessionId = {
    id:string
}


export function useChatSession (){

    const [chatHistory,setChatHistory] = useState<chatHistory | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [sessionId, setSessionId] = useState<sessionId | null>(null)


    useEffect(() => {
        setIsMounted(true);
      }, []);
    
    useEffect(() =>{
        if (!isMounted) return;
        const savedHistory = localStorage.getItem('chatHistory');

        setChatHistory(savedHistory ? JSON.parse(savedHistory): null);
    },[isMounted]);


    const saveChatHistory = (history:chatHistory)=>{
        localStorage.setItem('chatHistory',JSON.stringify(history))
        setChatHistory(history);
    };

    const clearChatHistory = () =>{
        localStorage.removeItem('chatHistory');
        setChatHistory(null)
    };

    const saveSession = (session:sessionId)=>{
        localStorage.setItem('geezLink-sessionId',session.id)
        setSessionId(session)
    }

    const deleteSession = () =>{
        localStorage.removeItem('geezLink-sessionId')
    }

    return {
        chatHistory,
        saveChatHistory,
        clearChatHistory,
        deleteSession,
        saveSession,
        sessionId,
    }
}