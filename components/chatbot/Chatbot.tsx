"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, SendHorizontal, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ChatApiRequest, ChatMessage } from '@/components/chatbot/types/chat';
/* eslint-disable @typescript-eslint/no-explicit-any */

// --- IMPORTS FOR TYPES ---
// Assuming '@/types/chat' contains: ChatMessage (role, content, timestamp), ChatApiRequest ({ history })

// Note: If you haven't created the '@/types/chat' file yet, you must define 
// ChatMessage and ChatApiRequest directly here or create the file.
// For this final code block, we assume the import path is correct.
// -------------------------


export default function Chatbot() {
  // State to hold the conversation history, using the imported ChatMessage type
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      content: "Hello! I'm AdGram Helper. How can I assist you with the marketplace today?",
      timestamp: Date.now() 
    }
  ]);
  
  // State for the user's current input
  const [input, setInput] = useState("");
  
  // State to manage the loading/thinking indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // A ref to the scroll area DOM element for auto-scrolling
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
          // Use a small timeout to allow the DOM to update before scrolling
          setTimeout(() => {
            viewport.scrollTop = viewport.scrollHeight;
          }, 50);
      }
    }
  }, [messages]);

  // Function to handle the form submission and streaming
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userPrompt = input.trim();
    if (!userPrompt || isLoading) return;

    setIsLoading(true);
    setInput("");

    // 1. Prepare User Message
    const userMessage: ChatMessage = { 
        role: 'user', 
        content: userPrompt,
        timestamp: Date.now(),
    };

    // 2. Add user message and model placeholder to the history
    const historyWithUserMessage: ChatMessage[] = [...messages, userMessage];
    
    const modelPlaceholder: ChatMessage = { 
        role: 'model', 
        content: '', // Start empty for streaming
        timestamp: Date.now() + 1,
    };
    
    // Optimistically update the state with both new messages (user and empty model)
    setMessages([...historyWithUserMessage, modelPlaceholder]);


    try {
        // 3. Prepare the API Request Body
        const requestBody: ChatApiRequest = {
            history: historyWithUserMessage, // Send the full history for context
        };
        
        // 4. Call the streaming API route
        const res = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody), 
        });

        if (!res.ok || !res.body) {
            throw new Error("Failed to connect to the AI model or stream failed.");
        }
        
        // 5. Read the Streaming Response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let receivedContent = '';
        
        // Function to update the last message in state with new content
        const updateStream = (newChunk: string) => {
            receivedContent += newChunk;
            
            setMessages(prev => {
                // Find the last message (the placeholder) and update its content
                const updatedMessages = [...prev];
                const lastIndex = updatedMessages.length - 1;
                
                // Safety check: ensure we are updating the model's message
                if (updatedMessages[lastIndex].role === 'model') {
                    updatedMessages[lastIndex].content = receivedContent;
                }
                return updatedMessages;
            });
        };
        
        // Loop to read the stream chunks
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            // Decode the chunk (it's raw text)
            const chunk = decoder.decode(value, { stream: true });
            
            // Update the state with the chunk
            updateStream(chunk);
        }

    } catch (error: any) {
        console.error("Chatbot streaming error:", error);
        toast.error(error.message || 'An unexpected error occurred during AI generation.');
        
        // Rollback: Remove the user's message and the failed model placeholder
        setMessages(prev => prev.slice(0, prev.length - 2)); 

    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col rounded-lg">
      <CardHeader className="flex flex-row items-center gap-3 border-b">
        <Bot className="h-8 w-8 text-primary" />
        <div>
          <CardTitle>AdGram Helper</CardTitle>
          <p className="text-sm text-muted-foreground">Your marketplace assistant</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 p-4">
            {messages.map((msg, index) => (
              <div key={index} className={cn("flex items-start gap-3 w-full", msg.role === 'user' && "justify-end flex-row-reverse")}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "p-3 rounded-lg max-w-[80%] whitespace-pre-wrap", // preserves line breaks from Gemini output
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}>
                  {/* Using msg.content as defined in ChatMessage type */}
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {/* The 'Thinking...' indicator now only shows if isLoading is true AND the last message is still the placeholder */}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about buying or selling..."
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <SendHorizontal size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
}