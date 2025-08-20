import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin";
import { SimpleToolbar } from "@/components/editor/plugins/simple-toolbar";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <SimpleToolbar />

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="lexical-content">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Mulai menulis artikel..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
        <ListPlugin />
        <ImagesPlugin />
      </div>
      {/* actions plugins */}
    </div>
  );
}
