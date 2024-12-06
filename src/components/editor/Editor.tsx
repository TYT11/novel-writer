"use client";

import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ToolbarContext } from "./Toolbar";
import ToolbarPlugin from "./Toolbar";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

const theme = {
  text: {
    bold: "bold",
    italic: "italic",
    strikethrough: "line-through",
    underline: "underline",
  },
  heading: {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode],
  };
  return (
    <div className="relative w-full max-w-5xl">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex flex-col items-center">
          <ToolbarContext>
            <ToolbarPlugin />
          </ToolbarContext>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="relative w-full min-h-32 max-h-96 overflow-y-auto border-2 p-2 focus:outline-none"
                aria-placeholder="Enter some text..."
                placeholder={
                  <p className="absolute top-9 left-3 text-gray-400">
                    Enter some text...
                  </p>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

export default Editor;
