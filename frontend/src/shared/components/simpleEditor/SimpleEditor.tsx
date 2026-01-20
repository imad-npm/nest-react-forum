import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaImage,
  FaLink,
  FaUnlink,
} from 'react-icons/fa';
interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const extensions = [TextStyleKit, StarterKit];

function MenuBar({ editor }: { editor: any }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold') ?? false,
      canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor.isActive('italic') ?? false,
      canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
      isStrike: ctx.editor.isActive('strike') ?? false,
      canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
      isCode: ctx.editor.isActive('code') ?? false,
      canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
      isBulletList: ctx.editor.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor.isActive('orderedList') ?? false,
      isBlockquote: ctx.editor.isActive('blockquote') ?? false,
      isLink: ctx.editor.isActive('link') ?? false,
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,
    }),
  });

  // image upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
    // clear input to allow re-uploading same file later
    if (e.target) e.target.value = '';
  };

  // link UI
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const linkInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // when opening link input, prefill with current link if any
    if (showLinkInput) {
      const currentHref = editor?.getAttributes?.('link')?.href ?? '';
      const target = editor?.getAttributes?.('link')?.target ?? '';
      setLinkValue(currentHref);
      setOpenInNewTab(Boolean(target === '_blank'));
      setTimeout(() => linkInputRef.current?.focus(), 50);
    }
  }, [showLinkInput, editor]);

  const applyLink = () => {
    if (!linkValue || !linkValue.trim()) {
      // if empty, remove link
      editor.chain().focus().unsetLink().run();
    } else {
      // ensure scheme (simple)
      let href = linkValue.trim();
      if (!/^[a-zA-Z][\w-+:.]*:/.test(href)) {
        href = href.startsWith('//') ? `https:${href}` : `https://${href}`;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href, target: openInNewTab ? '_blank' : undefined })
        .run();
    }
    setShowLinkInput(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  // small helpers
  const buttonClass = (active: boolean) =>
    `flex items-center justify-center p-2 rounded-md hover:bg-blue-50 transition ${
      active ? 'bg-blue-600 text-white' : 'text-gray-600'
    }`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2 border-b border-gray-200 pb-2">
        <button type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={buttonClass(editorState.isBold)}
          title="Bold"
        >
          <FaBold />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={buttonClass(editorState.isItalic)}
          title="Italic"
        >
          <FaItalic />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={buttonClass(editorState.isStrike)}
          title="Strike"
        >
          <FaStrikethrough />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={buttonClass(editorState.isCode)}
          title="Inline code"
        >
          <FaCode />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editorState.isBulletList)}
          title="Bullet list"
        >
          <FaListUl />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editorState.isOrderedList)}
          title="Ordered list"
        >
          <FaListOl />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editorState.isBlockquote)}
          title="Blockquote"
        >
          <FaQuoteRight />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className={buttonClass(false)}
          title="Undo"
        >
          <FaUndo />
        </button>

        <button type='button'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className={buttonClass(false)}
          title="Redo"
        >
          <FaRedo />
        </button>

        <button type='button'
          onClick={handleImageClick}
          className={buttonClass(false)}
          title="Insert image from file"
        >
          <FaImage />
        </button>

        <button type='button'
          onClick={() => setShowLinkInput((s) => !s)}
          className={buttonClass(editorState.isLink || showLinkInput)}
          title={editorState.isLink ? 'Edit link' : 'Insert link'}
        >
          {editorState.isLink ? <FaUnlink /> : <FaLink />}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Link input panel (inline) */}
      {showLinkInput && (
        <div className="flex items-center gap-2">
          <input
            ref={linkInputRef}
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink();
              if (e.key === 'Escape') setShowLinkInput(false);
            }}
            placeholder="https://example.com or relative/path"
            className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <label className="inline-flex items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">new tab</span>
          </label>
          <button type='button'
            onClick={applyLink}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Apply
          </button>
          <button type='button' 
            onClick={() => {
              removeLink();
            }}
            className="px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
          >
            Remove
          </button>
          <button type='button'
            onClick={() => setShowLinkInput(false)}
            className="px-2 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50"
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({ value, onChange }) => {
  // Unique id for scoping CSS to this editor instance only
  const uidRef = useRef(`editor-${Math.random().toString(36).slice(2, 9)}`);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, HTMLAttributes: { rel: 'noopener' } }),
      Image.configure({ inline: false }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[250px] border border-gray-300 rounded-md p-4 text-sm focus:outline-none focus:ring-0 transition-shadow',
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  // Scoped CSS that targets only elements inside this editor instance.
  // You can adjust these rules to fit your design system.
 
  return (
    <div id={uidRef.current} className="bg-white rounded-md border border-gray-300 p-3">
      {/* scoped styles (only for this instance) */}

      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="my-editor prose max-w-full" />
    </div>
  );
};
