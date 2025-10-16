import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism, Highlight, themes } from "../utils/prism-languages";
import remarkGfm from "remark-gfm";
import { FaCopy } from "react-icons/fa6";
import { useState, useMemo } from "react";

// Memoized code block component using prism-react-renderer
const CodeBlock = memo(({ language, children, onCopy, copySuccess }) => {
  const code = String(children).trim();

  return (
    <div className="code-block-container mt-2 mb-2">
      <div className="code-block-header flex justify-between items-center p-2">
        <div className="text-xs">{language}</div>
        <button
          onClick={() => onCopy(code)}
          className="copy-button rounded-sm text-xs flex items-center gap-1"
        >
          <FaCopy className="text-xs" />
          <p className="text-xs">{!copySuccess ? "Copy" : copySuccess}</p>
        </button>
      </div>
      <Highlight
        prism={Prism}
        theme={themes.vsDark}
        code={code}
        language={language || "text"}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className}`}
            style={{
              ...style,
              margin: 0,
              padding: "0.75rem",
              overflow: "auto",
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
});

// Memoized inline code component
const InlineCode = memo(({ children, className }) => (
  <code
    className={
      className || "px-1.5 py-0.5 mx-0.5 bg-gray-900 rounded-sm text-sm"
    }
  >
    {children}
  </code>
));

const LLMOutputDisplay = ({ output = "" }) => {
  const [copySuccess, setCopySuccess] = useState("");

  const displayedText = String(output)
    .replace(/undefined/g, "")
    .trim();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => setCopySuccess("Copied!"),
      (err) => setCopySuccess("Failed")
    );
    setTimeout(() => setCopySuccess(""), 4000);
  };

  // Memoize markdown components
  const components = useMemo(
    () => ({
      p: memo(({ children }) => (
        <p className="mb-4 leading-relaxed">{children}</p>
      )),
      ul: memo(({ children }) => (
        <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
      )),
      ol: memo(({ children }) => (
        <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
      )),
      li: memo(({ children }) => <li className="mb-1">{children}</li>),
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <CodeBlock
            language={match[1]}
            onCopy={copyToClipboard}
            copySuccess={copySuccess}
          >
            {children}
          </CodeBlock>
        ) : (
          <InlineCode className={className} {...props}>
            {children}
          </InlineCode>
        );
      },
    }),
    [copySuccess]
  );

  if (!displayedText) return null;

  return (
    <div className="transition-opacity duration-200">
      <div className="space-y-4">
        <ReactMarkdown
          children={displayedText}
          components={components}
          remarkPlugins={[remarkGfm]}
        />
      </div>
    </div>
  );
};

export default memo(LLMOutputDisplay);
