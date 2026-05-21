import { cn } from '@/lib/utils';

export default function RichTextContent({ html = '', className }) {
    if (!html?.trim() || html === '<p></p>') {
        return null;
    }

    return (
        <div
            className={cn('article-content text-tblack', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
