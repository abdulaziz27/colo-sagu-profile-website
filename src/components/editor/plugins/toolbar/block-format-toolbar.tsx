import { BlockFormatDropDown } from "./block-format-toolbar-plugin";
import { FormatParagraph } from "./block-format/format-paragraph";
import { FormatHeading } from "./block-format/format-heading";
import { FormatBulletedList } from "./block-format/format-bulleted-list";
import { FormatNumberedList } from "./block-format/format-numbered-list";
import { FormatQuote } from "./block-format/format-quote";

export function BlockFormatToolbarPlugin({ blockType }: { blockType: string }) {
  return (
    <BlockFormatDropDown>
      <FormatParagraph />
      <FormatHeading level={1} />
      <FormatHeading level={2} />
      <FormatHeading level={3} />
      <FormatBulletedList />
      <FormatNumberedList />
      <FormatQuote />
    </BlockFormatDropDown>
  );
}
