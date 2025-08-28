'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Card } from '@/components/ui/card';

type TextBlockProps = {
    content: string;
};

export function TextBlock({ content }: TextBlockProps) {
    return (
        <Card className="p-6 shadow-none border-none">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {content}
                </ReactMarkdown>
            </div>
        </Card>
    );
}