import { Editor } from "@tinymce/tinymce-react";
import { tinyMCEConfig } from "../../utils/tinyMCEConfig";

export default function RichTextEditor({ value, onChange }) {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      init={tinyMCEConfig}
      onEditorChange={(content) => onChange(content)}
    />
  );
}
