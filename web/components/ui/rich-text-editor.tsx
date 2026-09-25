"use client";

import { useCallback, useEffect } from "react";
import { $getRoot, $createParagraphNode, EditorState } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { $isRangeSelection, FORMAT_TEXT_COMMAND, $getSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const editorTheme = {
  heading: { h1: "text-xl font-bold", h2: "text-lg font-bold" },
  list: {
    ul: "list-disc pl-5",
    ol: "list-decimal pl-5",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
};

function onError(error: unknown) {
  console.error(error);
}

// Syncs Lexical -> parent form state as HTML
function HtmlOnChangePlugin({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange(html);
      });
    },
    [editor, onChange],
  );

  return <OnChangePlugin onChange={handleChange} />;
}

// Hydrates Lexical from an initial HTML string (edit mode / draft restore)
function InitialHtmlPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!html) return;
    editor.update(() => {
      const root = $getRoot();
      if (root.getFirstChild() !== null) return; // only hydrate once, on mount
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      root.clear();
      nodes.forEach((node) => root.append(node));
      if (root.getChildrenSize() === 0) {
        root.append($createParagraphNode());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return null;
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (level: "h1" | "h2") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level));
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input p-1">
      <Toggle
        size="sm"
        onPressedChange={() => formatHeading("h1")}
        aria-label="Heading 1"
      >
        <Heading1 className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => formatHeading("h2")}
        aria-label="Heading 2"
      >
        <Heading2 className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }
        aria-label="Bold"
      >
        <Bold className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }
        aria-label="Italic"
      >
        <Italic className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }
        aria-label="Underline"
      >
        <UnderlineIcon className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        aria-label="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Bullet list"
      >
        <List className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Numbered list"
      >
        <ListOrdered className="size-4" />
      </Toggle>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder = "Write here...",
  className,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "proposal-editor",
    theme: editorTheme,
    editable: !disabled,
    nodes: [HeadingNode, ListNode, ListItemNode],
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          "rounded-md border border-input bg-transparent shadow-sm",
          "focus-within:ring-1 focus-within:ring-ring",
          className,
        )}
      >
        <Toolbar />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="prose prose-sm min-h-40 max-w-none px-3 py-2 focus:outline-none"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="pointer-events-none absolute inset-0 px-3 py-2 text-muted-foreground">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <ListPlugin />
        <HtmlOnChangePlugin onChange={onChange} />
        <InitialHtmlPlugin html={value} />
      </div>
    </LexicalComposer>
  );
}
