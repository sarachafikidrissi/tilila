import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import {
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Quote,
    Strikethrough,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ToolbarButton({ onClick, active, label, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={cn(
                'inline-flex size-8 items-center justify-center rounded-md text-xs font-semibold transition',
                active
                    ? 'bg-beta-blue text-twhite'
                    : 'text-tblack hover:bg-muted',
            )}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Write your article…',
    className,
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class:
                    'article-editor tiptap min-h-[260px] px-3 py-3 focus:outline-none',
            },
        },
        onUpdate: ({ editor: current }) => {
            onChange?.(current.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const current = editor.getHTML();
        const next = value || '';

        if (current !== next) {
            editor.commands.setContent(next || '<p></p>', false);
        }
    }, [editor, value]);

    if (!editor) {
        return (
            <div
                className={cn(
                    'min-h-[300px] rounded-md border border-input bg-background',
                    className,
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-md border border-input bg-background shadow-xs focus-within:ring-2 focus-within:ring-beta-blue/25',
                className,
            )}
        >
            <div className="flex flex-wrap gap-1 border-b border-border/70 bg-muted/40 p-2">
                <ToolbarButton
                    label="Bold"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Italic"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Strikethrough"
                    active={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="size-4" />
                </ToolbarButton>
                <span className="mx-1 w-px self-stretch bg-border" aria-hidden />
                <ToolbarButton
                    label="Heading 1"
                    active={editor.isActive('heading', { level: 1 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >
                    <Heading1 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Heading 2"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    <Heading2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Heading 3"
                    active={editor.isActive('heading', { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >
                    <Heading3 className="size-4" />
                </ToolbarButton>
                <span className="mx-1 w-px self-stretch bg-border" aria-hidden />
                <ToolbarButton
                    label="Bullet list"
                    active={editor.isActive('bulletList')}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Numbered list"
                    active={editor.isActive('orderedList')}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Quote"
                    active={editor.isActive('blockquote')}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                >
                    <Quote className="size-4" />
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
