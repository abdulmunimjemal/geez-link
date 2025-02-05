'use client';

import { useEffect,useState } from "react";

type chatMessage = {
    content:string;
    owner?:string;
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
        const savedSession = localStorage.getItem('geezLink-sessionId');
        const savedHistory = localStorage.getItem('chatHistory');

        if (savedSession) {
            setSessionId({ id: savedSession });
        }
        if (savedHistory) {
            setChatHistory(JSON.parse(savedHistory));
        }
    }, []);


    useEffect(() => {
        if (!isMounted) return;
        
        if (sessionId) {
            localStorage.setItem('geezLink-sessionId', sessionId.id);
        } else {
            localStorage.removeItem('geezLink-sessionId');
        }
    }, [sessionId, isMounted]);



    
    useEffect(() => {
        if (!isMounted) return;
        
        if (chatHistory) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } else {
            localStorage.removeItem('chatHistory');
        }
    }, [chatHistory, isMounted]);


    const saveChatHistory = (history: chatHistory) => {
        setChatHistory(history);
    };

    const clearChatHistory = () => {
        localStorage.removeItem('chatHistory');
        setChatHistory(null);
    };

    const saveSession = (session: sessionId) => {
        setSessionId(session);
    };

    const deleteSession = () => {
        localStorage.removeItem('geezLink-sessionId');
        setSessionId(null);
    };

    return {
        chatHistory,
        sessionId,
        saveChatHistory,
        clearChatHistory,
        saveSession,
        deleteSession,
        isMounted
    };
}