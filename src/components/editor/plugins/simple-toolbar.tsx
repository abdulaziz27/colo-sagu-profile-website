import { useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createParagraphNode } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  ImageIcon,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadDialog } from "@/components/editor/plugins/image-upload-dialog";

export function SimpleToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
          setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
        return false;
      },
      1
    );
  }, [editor]);

  const formatText = (
    format: "bold" | "italic" | "underline" | "strikethrough"
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        switch (type) {
          case "paragraph":
            $setBlocksType(selection, () => $createParagraphNode());
            break;
          case "h1":
            $setBlocksType(selection, () => $createHeadingNode("h1"));
            break;
          case "h2":
            $setBlocksType(selection, () => $createHeadingNode("h2"));
            break;
          case "h3":
            $setBlocksType(selection, () => $createHeadingNode("h3"));
            break;
          case "quote":
            $setBlocksType(selection, () => $createQuoteNode());
            break;
        }
      }
    });
    setBlockType(type);
  };

  const insertList = (type: "bullet" | "number") => {
    if (type === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="lexical-toolbar">
      {/* Block Format */}
      <Select value={blockType} onValueChange={formatBlock}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Paragraph
            </div>
          </SelectItem>
          <SelectItem value="h1">
            <div className="flex items-center gap-2">
              <Heading1 className="w-4 h-4" />
              Heading 1
            </div>
          </SelectItem>
          <SelectItem value="h2">
            <div className="flex items-center gap-2">
              <Heading2 className="w-4 h-4" />
              Heading 2
            </div>
          </SelectItem>
          <SelectItem value="h3">
            <div className="flex items-center gap-2">
              <Heading3 className="w-4 h-4" />
              Heading 3
            </div>
          </SelectItem>
          <SelectItem value="quote">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4" />
              Quote
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Format */}
      <Button
        variant={isBold ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("bold")}
        className="toolbar-button"
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        variant={isItalic ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("italic")}
        className="toolbar-button"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        variant={isUnderline ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("underline")}
        className="toolbar-button"
      >
        <Underline className="w-4 h-4" />
      </Button>

      <Button
        variant={isStrikethrough ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("strikethrough")}
        className="toolbar-button"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertList("bullet")}
        className="toolbar-button"
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertList("number")}
        className="toolbar-button"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Image */}
      <ImageUploadDialog />
    </div>
  );
}
