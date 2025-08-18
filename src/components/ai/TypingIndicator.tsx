import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 justify-start">
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
            <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
        </Avatar>
      <div className="bg-muted rounded-lg px-4 py-3 flex items-center space-x-1">
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}