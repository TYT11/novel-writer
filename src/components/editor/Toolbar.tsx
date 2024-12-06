"use client";

import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  createContext,
} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  $isRootOrShadowRoot,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;
const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

const INITIAL_TOOLBAR_STATE = {
  bgColor: "#fff",
  blockType: blockTypeToBlockName["paragraph"],
  canRedo: false,
  canUndo: false,
  codeLanguage: "",
  elementFormat: "left",
  fontColor: "#000",
  fontFamily: "Arial",
  // Current font size in px
  fontSize: `${DEFAULT_FONT_SIZE}px`,
  // Font size input value - for controlled input
  fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
  isBold: false,
  isCode: false,
  isImageCaption: false,
  isItalic: false,
  isLink: false,
  isRTL: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isUnderline: false,
  rootType: "root",
};

const Context = createContext(undefined);

export const ToolbarContext = ({ children }): JSX.Element => {
  const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE);
  const selectionFontSize = toolbarState.fontSize;

  const updateToolbarState = useCallback((key, value) => {
    setToolbarState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  useEffect(() => {
    updateToolbarState("fontSizeInputValue", selectionFontSize.slice(0, -2));
  }, [selectionFontSize, updateToolbarState]);

  const contextValue = useMemo(() => {
    return {
      toolbarState,
      updateToolbarState,
    };
  }, [toolbarState, updateToolbarState]);

  // const contextValue = {
  //   toolbarState,
  //   updateToolbarState,
  // };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useToolbarState = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useToolbarState must be used within a ToolbarProvider");
  }

  return context;
};

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { updateToolbarState, toolbarState } = useToolbarState();
  const [activeEditor, setActiveEditor] = useState();
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      const anchorNode = selection?.anchor.getNode();
      const parentNode = anchorNode?.getParent();
      const node = $isRootNode(anchorNode)
        ? anchorNode
        : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });
      console.log("anchor", anchorNode, $isRootNode(anchorNode));
      console.log("parent", node, "node");

      const blockType = $isHeadingNode(node) ? node.getTag() : node?.getType();
      const blockName = blockTypeToBlockName[blockType];
      console.log(blockName, "blockName");
      if (blockName) {
        updateToolbarState("blockType", blockName);
      }
      updateToolbarState("isBold", selection.hasFormat("bold"));
      updateToolbarState("isItalic", selection.hasFormat("italic"));
    }
  }, []);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatParagrah = () => {
    const { blockType } = toolbarState;
    if (blockType !== blockTypeToBlockName["paragraph"]) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize) => {
    const { blockType } = toolbarState;
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        console.log(selection, "selection");
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };
  useEffect(() => {
    const unregisterUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }
    );
    const unregisterSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );

    return () => {
      unregisterUpdateListener();
      unregisterSelection();
    };
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar sticky top-0 bg-white self-start d-flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="pr-1">
          <div className="flex gap-1 items-center">
            {toolbarState.blockType}
            <i className="flex bg-chevron-down contain w-4 h-4 opacity-100 mr-" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button className="flex flex-1" onClick={() => formatParagrah()}>
              <i
                className={clsx(
                  "flex bg-paragraph contain w-4 h-4 opacity-100 mr-2"
                )}
              />
              <div>Normal</div>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button className="flex flex-1" onClick={() => formatHeading("h1")}>
              <i
                className={clsx("flex bg-h1 contain w-4 h-4 opacity-100 mr-2")}
              />
              <div>Heading 1</div>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button className="flex flex-1" onClick={() => formatHeading("h2")}>
              <i
                className={clsx("flex bg-h2 contain w-4 h-4 opacity-100 mr-2")}
              />
              <div>Heading 2</div>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button onClick={() => formatText("bold")}>
        <i
          className={clsx(
            "flex bg-bold contain w-4 h-4",
            toolbarState.isBold ? "opacity-100" : "opacity-30"
          )}
        />
      </button>
      <button onClick={() => formatText("italic")}>
        <i
          className={clsx(
            "flex bg-italic contain w-4 h-4",
            toolbarState.isItalic ? "opacity-100" : "opacity-30"
          )}
        />
      </button>
    </div>
  );
};

export default ToolbarPlugin;
