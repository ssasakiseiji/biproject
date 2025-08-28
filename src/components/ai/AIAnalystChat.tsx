'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { getAIResponse } from '@/services/aiAnalystService';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import type { DashboardData } from '@/lib/types';
import { getPageData } from '@/services/dataService'; // Importamos getPageData

export interface ChatMessage {
    text: string;
    sender: 'user' | 'ai';
}

export default function AIAnalystChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [dashboardContext, setDashboardContext] = useState<DashboardData | null>(null);

    // Efecto para cargar los datos del dashboard cuando el componente se monta
    useEffect(() => {
        // Obtenemos los datos del dashboard de ventas para el chat
        getPageData('sales', 'overview').then(data => {
            setDashboardContext(data);
        });
    }, []);


    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                 setTimeout(() => {
                    viewport.scrollTop = viewport.scrollHeight;
                }, 100);
            }
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !dashboardContext) return;

        const userMessage: ChatMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const aiResponseText = await getAIResponse(inputValue, dashboardContext);
            const aiMessage: ChatMessage = { text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card border rounded-lg shadow-lg">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <Message key={index} text={msg.text} sender={msg.sender} />
                    ))}
                    {isTyping && <TypingIndicator />}
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Ask about sales, top products, etc."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1"
                        disabled={isTyping || !dashboardContext}
                    />
                    <Button type="submit" disabled={isTyping || !inputValue.trim() || !dashboardContext}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}