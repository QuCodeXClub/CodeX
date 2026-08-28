# CodeX Image Guidelines

To maintain performance, consistency, and a clean project structure, all frontend image assets must adhere to the following guidelines.

---

## 1. Storage Location

### Cloudinary (Preferred & Recommended)
* **Action Required:** Either all images should be moved to **Cloudinary**, or they should strictly reside in the `public` folder.
* Cloudinary handles on-the-fly transformations and serves images via a fast CDN, which drastically improves frontend load times and user experience.
* When using Cloudinary, images should be referenced via their secure Cloudinary URLs.

### Frontend `public` Folder
* If images must be stored locally within the frontend repository, they **MUST** be placed exclusively in the `public/` directory (e.g., `Frontend/public/images/`).
* **Do not** store images inside the `src/` directory (e.g., avoid `src/assets/images/`).
* Always reference them relative to the public path in your components (e.g., `<img src="/images/example.webp" />`).

---

## 2. Image Format

* All images **MUST** be in the `.webp` format.
* Avoid using `.png`, `.jpg`, or `.jpeg` formats. The `.webp` format provides superior lossless and lossy compression, resulting in significantly smaller file sizes.

---

## 3. Image Optimization

* All images must be **optimized** before uploading to Cloudinary or committing to the repository.
* **Cloudinary Optimization:** If using Cloudinary, ensure you use the automatic format (`f_auto`) and quality (`q_auto`) parameters. This ensures Cloudinary serves the best optimized `.webp` format to the browser.
* **Local Optimization:** For local images in the `public/` folder, run them through an optimization tool (like Squoosh, TinyPNG, or a CLI converter) to convert them to `.webp` and compress them prior to committing.
