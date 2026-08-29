import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import ImageLightboxModal from "../components/common/ImageLightboxModal";
import { removeImageOptimization } from "../utils/helpers";

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

    // Remove optimization and transformation attributes (e.g. f_auto, q_auto, w_1200) to load the raw original image
    const rawHighResSrc = removeImageOptimization(imageData.src);

    setLightboxState({
      isOpen: true,
      image: {
        src: rawHighResSrc,
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

  // Opt-in click delegate: only triggers for elements explicitly designated with data-zoom-src or data-zoomable
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // 1. Elements with explicit data-zoom-src
      const customZoomTarget = e.target.closest("[data-zoom-src]");
      if (customZoomTarget) {
        e.preventDefault();
        openImage({
          src: customZoomTarget.getAttribute("data-zoom-src"),
          alt: customZoomTarget.getAttribute("data-zoom-alt") || "Full Preview",
        });
        return;
      }

      // 2. Elements with explicit data-zoomable
      const zoomContainer = e.target.closest("[data-zoomable]");
      if (zoomContainer) {
        let img = e.target.closest("img");
        if (!img) {
          const allImgs = Array.from(zoomContainer.querySelectorAll("img"));
          img =
            allImgs.find(
              (i) =>
                !i.closest(".opacity-0, [aria-hidden='true'], .pointer-events-none") &&
                i.offsetParent !== null
            ) || allImgs[0];
        }

        if (img) {
          e.preventDefault();
          openImage({
            src: img.currentSrc || img.src,
            alt: img.alt || img.title || "Full Preview",
          });
        }
      }
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
