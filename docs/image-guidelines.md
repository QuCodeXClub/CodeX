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

---

## 4. Interactive Image Zoom & Lightbox (`useImageZoom`)

For high-resolution previews (e.g. event banners, certificates, gallery moments, receipts, and infographics), CodeX provides a centralized, smooth image zoom lightbox powered by `ImageZoomContext`.

### 4.1 Recommended Approach: `useImageZoom` React Hook

The recommended way to enable zoom for any image component is via the `useImageZoom` hook.

```jsx
import React from "react";
import { useImageZoom } from "../context/ImageZoomContext"; // Adjust relative path

export default function EventBanner({ event }) {
  const { openImage } = useImageZoom();

  return (
    <div className="relative group overflow-hidden rounded-2xl">
      <img
        src={event.coverImage}
        alt={event.eventName}
        onClick={() =>
          openImage({
            src: event.coverImage,
            alt: event.eventName,
          })
        }
        className="w-full object-cover cursor-zoom-in transition-all duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}
```

#### Hook Return Values & Parameters
* `openImage({ src, alt, caption })`: Opens the full-screen smooth lightbox.
  * `src` *(string, required)*: The image URL. The provider automatically strips Cloudinary thumbnail transforms (like `w_800`, `q_auto`, etc.) to load the raw high-resolution image asset.
  * `alt` *(string, optional)*: Text shown in the lightbox header.
  * `caption` *(string, optional)*: Optional extra text/details.
* `closeImage()`: Manually closes the active lightbox.

---

### 4.2 Alternative: HTML Data Attribute Delegation

If you cannot or do not want to import the hook directly into a component, you can use HTML data attributes:

```jsx
<div
  data-zoom-src={imageSrc}
  data-zoom-alt="Event Poster"
  className="cursor-zoom-in"
>
  <img src={imageSrc} alt="Event Poster" />
</div>
```

---

### 4.3 UI Pattern: Optional Zoom Badge on Hover

To provide visual feedback matching the CodeX design system, you can overlay a floating badge:

```jsx
import { ZoomIn } from "lucide-react";
import { useImageZoom } from "../context/ImageZoomContext";

export default function GalleryCard({ item }) {
  const { openImage } = useImageZoom();

  return (
    <div
      onClick={() => openImage({ src: item.imageUrl, alt: item.title })}
      className="group relative overflow-hidden rounded-2xl cursor-zoom-in border border-border/80"
    >
      {/* Zoom Badge on Hover */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg pointer-events-none">
        <ZoomIn size={13} className="text-accent" />
        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Zoom</span>
      </div>

      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}
```

---

### 4.4 Built-in Lightbox Features
Images opened with `useImageZoom` automatically benefit from:
* **Hardware-Accelerated Fluid Zooming**: Cubic-bezier spring scaling (`1x` to `4x`).
* **Interactive Navigation**: Mouse wheel zooming, click/tap toggle (`1x` <-> `2.2x`), and smooth drag & pan when enlarged.
* **Keyboard Navigation**: `+` / `=` (Zoom In), `-` / `_` (Zoom Out), `0` (Reset Zoom), `Escape` (Close).
* **Automatic High-Resolution Fetching**: Automatically bypasses thumbnail downscaling to load the original asset in full clarity.
