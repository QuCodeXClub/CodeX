import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import ImageLightboxModal from "../components/common/ImageLightboxModal";

const ImageZoomContext = createContext();

export const useImageZoom = () => {
  const context = useContext(ImageZoomContext);
  if (!context) {
    throw new Error("useImageZoom must be used within an ImageZoomProvider");
  }
  return context;
};

export const ImageZoomProvider = ({ children }) => {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    image: null,
  });

  const openImage = useCallback((imageData) => {
    if (!imageData?.src) return;

    // If Cloudinary URL has size constraints (e.g. w_800 or w_1200), load high-res original
    let highResSrc = imageData.src;
    if (highResSrc.includes("cloudinary.com") && highResSrc.includes("/w_")) {
      highResSrc = highResSrc.replace(/\/w_\d+/, "/w_1920");
    }

    setLightboxState({
      isOpen: true,
      image: {
        src: highResSrc,
        alt: imageData.alt || imageData.title || "Full Preview",
        caption: imageData.caption || "",
      },
    });
  }, []);

  const closeImage = useCallback(() => {
    setLightboxState({
      isOpen: false,
      image: null,
    });
  }, []);

  // Global click delegate for images across the frontend
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // 1. Check if user clicked an element with explicit data-zoom-src
      const customZoomTarget = e.target.closest("[data-zoom-src]");
      if (customZoomTarget) {
        e.preventDefault();
        openImage({
          src: customZoomTarget.getAttribute("data-zoom-src"),
          alt: customZoomTarget.getAttribute("data-zoom-alt") || "Full Preview",
        });
        return;
      }

      // 2. Check if user clicked an explicit zoom trigger or image container
      const zoomContainer = e.target.closest("[data-zoomable]");
      let img = e.target.closest("img");

      if (!img && zoomContainer) {
        // Find visible active image inside container
        const allImgs = Array.from(zoomContainer.querySelectorAll("img"));
        img =
          allImgs.find(
            (i) =>
              !i.closest(".opacity-0, [aria-hidden='true'], .pointer-events-none") &&
              i.offsetParent !== null
          ) || allImgs[0];
      }

      if (!img) return;

      // 3. Check exclusion criteria
      if (
        img.hasAttribute("data-no-zoom") ||
        img.classList.contains("no-zoom") ||
        img.closest("[data-no-zoom]") ||
        img.closest(".no-zoom")
      ) {
        return;
      }

      // 4. Skip header/footer logos or tiny UI icons (< 40px) unless explicitly data-zoomable
      const isBrandingOrLogo =
        img.src.includes("logo") ||
        img.src.includes("partner") ||
        img.closest("nav") ||
        img.closest("footer a");

      const isTinyIcon =
        (img.naturalWidth > 0 && img.naturalWidth < 40 && img.naturalHeight < 40) ||
        img.classList.contains("h-5") ||
        img.classList.contains("w-5") ||
        img.classList.contains("h-4") ||
        img.classList.contains("w-4");

      if ((isBrandingOrLogo || isTinyIcon) && !img.hasAttribute("data-zoomable") && !zoomContainer) {
        return;
      }

      // 5. If clicked inside an interactive button/link, only zoom if direct image was clicked
      const interactiveParent = e.target.closest("button, a");
      if (interactiveParent && !zoomContainer && !img.hasAttribute("data-zoomable")) {
        if (e.target.tagName !== "IMG") {
          return;
        }
      }

      // 6. Open lightbox
      e.preventDefault();
      openImage({
        src: img.currentSrc || img.src,
        alt: img.alt || img.title || "Full Preview",
      });
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [openImage]);

  return (
    <ImageZoomContext.Provider value={{ openImage, closeImage }}>
      {children}
      <ImageLightboxModal
        isOpen={lightboxState.isOpen}
        image={lightboxState.image}
        onClose={closeImage}
      />
    </ImageZoomContext.Provider>
  );
};
