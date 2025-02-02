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


export function useChatSession (){

    const [chatHistory,setChatHistory] = useState<chatHistory | null>(null);


    useEffect(() =>{

        const savedHistory = localStorage.getItem('chatHistory');

        setChatHistory(savedHistory ? JSON.parse(savedHistory): null);
    },[]);


    const saveChatHistory = (history:chatHistory)=>{
        localStorage.setItem('chatHistory',JSON.stringify(history))
        setChatHistory(history);
    };

    const clearChatHistory = () =>{
        localStorage.removeItem('chatHistory');
        setChatHistory(null)
    };

    return {
        chatHistory,
        saveChatHistory,
        clearChatHistory,
    }
}