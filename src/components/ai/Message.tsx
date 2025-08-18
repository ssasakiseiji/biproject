import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from 'lucide-react';

type MessageProps = {
    text: string;
    sender: 'user' | 'ai';
}

export default function Message({ text, sender }: MessageProps) {
    const isAI = sender === 'ai';

    return (
        <div className={cn("flex items-start gap-3", isAI ? "justify-start" : "justify-end")}>
            {isAI && (
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 text-sm",
                isAI
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
            )}>
                <p>{text}</p>
            </div>
             {!isAI && (
                 <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}