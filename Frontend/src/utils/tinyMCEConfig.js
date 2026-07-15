export const tinyMCEConfig = {
  height: 350,
  menubar: false,

  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
  ],

  toolbar:
    "undo redo | " +
    "blocks | bold italic underline forecolor backcolor | " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist outdent indent | " +
    "link image media table | " +
    "removeformat | code fullscreen",

  branding: false,

  resize: true,

  image_caption: true,

  automatic_uploads: true,

  convert_urls: false,

  content_style: `
    body{
      font-family:Inter,sans-serif;
      font-size:15px;
      padding:10px;
    }
  `,
};
