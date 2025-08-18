'use client';

import AIAnalystChat from "@/components/ai/AIAnalystChat";

export default function AIAnalystPage() {
    return (
        <div className="h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">AI Data Analyst</h1>
                <p className="text-muted-foreground">Ask questions about your business data.</p>
            </header>
            <div className="flex-1 flex flex-col min-h-0">
                 <AIAnalystChat />
            </div>
        </div>
    );
}