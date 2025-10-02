import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import Navbar from "@/components/Navbar"; // Your public-facing navbar
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ChatbotWidget />
      {/* <Toaster richColors position="top-center" /> */}
    </>
  );
}