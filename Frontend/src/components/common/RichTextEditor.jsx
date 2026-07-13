import { Editor } from "@tinymce/tinymce-react";
import { tinyMCEConfig } from "../../utils/tinyMCEConfig";

export default function RichTextEditor({
    value,
    onChange
}) {

    return (
        <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={value}
            init={tinyMCEConfig}
            onEditorChange={(content) => onChange(content)}
        />
    );
}