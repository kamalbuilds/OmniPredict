import { FunctionComponent, JSX } from "react";
import { useCurrentEditor } from "@tiptap/react";

const Menu: FunctionComponent = (): JSX.Element => {
  const { editor } = useCurrentEditor();

  if (!editor) return <div></div>;
  return (
    <div className="relative w-full h-fit flex flex-wrap text-black font-digi text-xs items-start justify-start gap-1">
      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor?.can().chain().focus().toggleBold().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("bold") ? "bg-sea" : "bg-gris"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor?.can().chain().focus().toggleItalic().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("italic") ? "bg-sea" : "bg-gris"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor?.can().chain().focus().toggleStrike().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("strike") ? "bg-sea" : "bg-gris"
        }`}
      >
        Strike
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCode().run()}
        disabled={!editor?.can().chain().focus().toggleCode().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("code") ? "bg-sea" : "bg-gris"
        }`}
      >
        Code
      </button>
      <button
        onClick={() => editor?.chain().focus().unsetAllMarks().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 bg-gris`}
      >
        Clear marks
      </button>
      <button
        onClick={() => editor?.chain().focus().clearNodes().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 bg-gris`}
      >
        Clear nodes
      </button>
      <button
        onClick={() => editor?.chain().focus().setParagraph().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("paragraph") ? "bg-sea" : "bg-gris"
        }`}
      >
        Paragraph
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("heading", { level: 1 }) ? "bg-sea" : "bg-gris"
        }`}
      >
        H1
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("heading", { level: 2 }) ? "bg-sea" : "bg-gris"
        }`}
      >
        H2
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("heading", { level: 3 }) ? "bg-sea" : "bg-gris"
        }`}
      >
        H3
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 4 }).run()
        }
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("heading", { level: 4 }) ? "bg-sea" : "bg-gris"
        }`}
      >
        H4
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 5 }).run()
        }
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("heading", { level: 5 }) ? "bg-sea" : "bg-gris"
        }`}
      >
        H5
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 6 }).run()
        }
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("heading", { level: 6 }) ? "bg-sea" : "bg-gris"
        }`}
      >
        H6
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("bulletList") ? "bg-sea" : "bg-gris"
        }`}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("orderedList") ? "bg-sea" : "bg-gris"
        }`}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("codeBlock") ? "bg-sea" : "bg-gris"
        }`}
      >
        Code block
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("blockquote") ? "bg-sea" : "bg-gris"
        }`}
      >
        Blockquote
      </button>
      <button
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 bg-gris`}
      >
        Horizontal rule
      </button>
      <button
        onClick={() => editor?.chain().focus().setHardBreak().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 bg-gris`}
      >
        Hard break
      </button>
      <button
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor?.can().chain().focus().undo().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 bg-gris`}
      >
        Undo
      </button>
      <button
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor?.can().chain().focus().redo().run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 bg-gris`}
      >
        Redo
      </button>
      <button
        onClick={() => editor?.chain().focus().setColor("#958DF1").run()}
        className={`rounded-lg py-1 px-1.5 flex items-center justify-center text-center cursor-pointer hover:opacity-70 ${
          editor?.isActive("textStyle") ? "bg-sea" : "bg-gris"
        }`}
      >
        Purple
      </button>
    </div>
  );
};

export default Menu;
