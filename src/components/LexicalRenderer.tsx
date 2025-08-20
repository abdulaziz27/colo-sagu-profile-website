import { SerializedEditorState, SerializedLexicalNode } from "lexical";

interface LexicalRendererProps {
  content: string;
}

function renderNode(node: SerializedLexicalNode): JSX.Element | string {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={node.version} className="mb-4">
          {node.children?.map((child, index) => (
            <span key={index}>{renderNode(child)}</span>
          ))}
        </p>
      );
    case "text":
      const textNode = node as any;
      let content = textNode.text;

      // Apply formatting
      if (textNode.format & 1) {
        // bold
        content = <strong>{content}</strong>;
      }
      if (textNode.format & 2) {
        // italic
        content = <em>{content}</em>;
      }
      if (textNode.format & 8) {
        // underline
        content = <u>{content}</u>;
      }
      if (textNode.format & 16) {
        // strikethrough
        content = <s>{content}</s>;
      }

      return content;
    case "heading":
      const headingNode = node as any;
      const HeadingTag = `h${headingNode.tag}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          key={node.version}
          className={`mb-4 font-bold ${
            headingNode.tag === 1
              ? "text-3xl"
              : headingNode.tag === 2
              ? "text-2xl"
              : headingNode.tag === 3
              ? "text-xl"
              : "text-lg"
          }`}
        >
          {node.children?.map((child, index) => (
            <span key={index}>{renderNode(child)}</span>
          ))}
        </HeadingTag>
      );
    case "image":
      const imageNode = node as any;
      return (
        <img
          key={node.version}
          src={imageNode.src}
          alt={imageNode.altText || ""}
          className="max-w-full h-auto my-4 rounded-lg"
        />
      );
      case "quote":
        return (
          <blockquote
            key={node.version}
            className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700"
          >
            {node.children?.map((child, index) => (
              <span key={index}>{renderNode(child)}</span>
            ))}
          </blockquote>
        );
      case "list":
        const listNode = node as any;
        const ListTag = listNode.listType === "bullet" ? "ul" : "ol";
        return (
          <ListTag key={node.version} className="my-4 pl-6">
            {node.children?.map((child, index) => (
              <span key={index}>{renderNode(child)}</span>
            ))}
          </ListTag>
        );
      case "listitem":
        return (
          <li key={node.version} className="mb-2">
            {node.children?.map((child, index) => (
              <span key={index}>{renderNode(child)}</span>
            ))}
          </li>
        );
      default:
      // For unknown node types, try to render children if they exist
      if (node.children && node.children.length > 0) {
        return (
          <div key={node.version}>
            {node.children.map((child, index) => (
              <span key={index}>{renderNode(child)}</span>
            ))}
          </div>
        );
      }
      return "";
  }
}

export function LexicalRenderer({ content }: LexicalRendererProps) {
  try {
    const editorState: SerializedEditorState = JSON.parse(content);

    if (!editorState.root || !editorState.root.children) {
      return (
        <p className="text-gray-500 italic">Konten artikel tidak tersedia</p>
      );
    }

    return (
      <div className="prose prose-lg max-w-none">
        {editorState.root.children.map((node, index) => (
          <div key={index}>{renderNode(node)}</div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error parsing Lexical content:", error);
    // Fallback to HTML rendering for old content
    return (
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          lineHeight: "1.8",
          color: "#374151",
        }}
      />
    );
  }
}
