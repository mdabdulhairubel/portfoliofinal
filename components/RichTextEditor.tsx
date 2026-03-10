
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Link as LinkIcon, Undo, Redo, Code
} from 'lucide-react';
import React from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const buttons = [
    {
      icon: <Heading1 size={16} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      label: 'H1',
    },
    {
      icon: <Heading2 size={16} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      label: 'H2',
    },
    {
      icon: <Bold size={16} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      label: 'Bold',
    },
    {
      icon: <Italic size={16} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      label: 'Italic',
    },
    {
      icon: <List size={16} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      label: 'Bullet List',
    },
    {
      icon: <ListOrdered size={16} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      label: 'Ordered List',
    },
    {
      icon: <Quote size={16} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      label: 'Blockquote',
    },
    {
      icon: <Code size={16} />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      label: 'Code Block',
    },
    {
      icon: <LinkIcon size={16} />,
      onClick: addLink,
      isActive: editor.isActive('link'),
      label: 'Link',
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/5 bg-[#111] rounded-t-xl">
      {buttons.map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={btn.onClick}
          className={`p-2 rounded-lg transition-all ${
            btn.isActive 
              ? 'bg-primary-500 text-black' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
      <div className="w-px h-6 bg-white/5 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 text-slate-400 hover:text-white transition-all"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 text-slate-400 hover:text-white transition-all"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 underline cursor-pointer',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-6 outline-none min-h-[200px] focus:ring-0',
      },
    },
  });

  // Update content if it changes from outside (e.g. when switching posts)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full bg-[#111] rounded-2xl border border-white/5 overflow-hidden focus-within:border-primary-500/50 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
