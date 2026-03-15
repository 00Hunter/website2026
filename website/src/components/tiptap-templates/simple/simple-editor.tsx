import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type SimpleEditorProps = {
  initialContent?: string
  onUpdate?: (value: { html: string; text: string }) => void
  className?: string
}

export function SimpleEditor({ initialContent, onUpdate, className }: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent ?? '<p>Start writing your blog post…</p>',
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML()
      const text = instance.getText()
      onUpdate?.({ html, text })
    },
  })

  if (!editor) return null

  const wrapperClassName = ['editor-wrapper', className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClassName}>
      <div className="editor-toolbar">
        <button
          type="button"
          className={`editor-button${editor.isActive('paragraph') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('heading', { level: 1 }) ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('heading', { level: 2 }) ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('heading', { level: 3 }) ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('bold') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('italic') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('bulletList') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('orderedList') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered list
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('blockquote') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('code') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          Code
        </button>
        <button
          type="button"
          className={`editor-button${editor.isActive('codeBlock') ? ' editor-button--active' : ''}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code block
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          HR
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  )
}

