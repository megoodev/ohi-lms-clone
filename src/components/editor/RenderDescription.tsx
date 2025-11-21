"use client";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import { useMemo } from "react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";
const RenderDescription = ({ json }: { json: JSONContent }) => {
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);
  return <div>{parse(output)}</div>;
};

export default RenderDescription;
