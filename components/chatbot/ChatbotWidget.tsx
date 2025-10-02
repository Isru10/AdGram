"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Chatbot from "./Chatbot";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full h-16 w-16 shadow-lg flex items-center justify-center"
          aria-label="Toggle Chatbot"
        >
          <MessageCircle
            className={cn(
              "h-8 w-8 transition-all duration-300 ease-in-out absolute",
              isOpen ? "scale-0 rotate-90" : "scale-100 rotate-0"
            )}
          />
          <X
            className={cn(
              "h-8 w-8 transition-all duration-300 ease-in-out absolute",
              isOpen ? "scale-100 rotate-0" : "scale-0 -rotate-90"
            )}
          />
        </Button>
      </DialogTrigger>

      {/* --- FIX IS HERE --- */}
      <DialogContent 
        className="p-0 border-0 max-w-md w-[90vw] h-[80vh] flex flex-col"
        // Changed `hideCloseButton={true}` to the correct `showCloseButton={false}`
        showCloseButton={false} 
      >

                <DialogHeader className="sr-only">
          <DialogTitle>AdGram Helper Chatbot</DialogTitle>
          <DialogDescription>
            An AI-powered chatbot to help you with questions about the marketplace.
          </DialogDescription>
        </DialogHeader>

        <Chatbot />
      </DialogContent>
      {/* --- END OF FIX --- */}
    </Dialog>
  );
}