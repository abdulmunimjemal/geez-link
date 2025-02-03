'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatSession } from "./hooks/useChatSession";

export default function Home() {
  const router = useRouter();
  const { chatHistory,sessionId } = useChatSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Use absolute paths for routing
    const path = sessionId?.id ? '/chat' : '/welcome';
    router.push(path);
  }, [sessionId, router, isMounted]);

  // Show consistent loading state during initial mount
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return null;
}