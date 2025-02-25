"use client"

import { useState, useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export function EditablePage() {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[calc(100vh-200px)]",
      },
    },
  })

  useEffect(() => {
    if (editor && !content) {
      editor.commands.focus("start")
    }
  }, [editor, content])

  return (
    <div className="w-full max-w-3xl mx-auto px-4 cursor-text" onClick={() => editor?.commands.focus()}>
      {!isFocused && !content && <div className="text-xl text-gray-400 mb-4 absolute">New Note</div>}
      <EditorContent editor={editor} className="min-h-[calc(100vh-200px)]" />
    </div>
  )
}

