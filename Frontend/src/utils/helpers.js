export const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  // Academic year runs from June to June.
  // Month 5 is June (0-indexed). A new academic year is automatically added when June arrives.
  const currentMonth = new Date().getMonth();
  const maxYear = currentMonth >= 5 ? currentYear : currentYear - 1;
  const years = [];
  for (let startYear = 2018; startYear <= maxYear; startYear++) {
    years.push(`${startYear}-${startYear + 1}`);
  }
  return years.reverse();
};

export const getAcademicYearFromDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month >= 5) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

export const optimizeCloudinaryUrl = (url, width = 1200) => {
  if (!url || typeof url !== "string") return url;

  try {
    const parsedUrl = new URL(url, window.location.origin);
    
    // Strict protocol allowlist
    if (!['http:', 'https:', 'blob:', 'data:'].includes(parsedUrl.protocol)) {
      return "";
    }
    
    // For data: URIs, ensure they are images
    if (parsedUrl.protocol === 'data:' && !parsedUrl.pathname.startsWith('image/')) {
      return "";
    }

    if (
      parsedUrl.hostname !== "res.cloudinary.com" ||
      parsedUrl.pathname.includes("/f_auto,")
    ) {
      return parsedUrl.href;
    }
    return parsedUrl.href.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  } catch {
    return "";
  }
};

export const removeImageOptimization = (url) => {
  if (!url || typeof url !== "string") return url;

  try {
    const parsedUrl = new URL(url, window.location.origin);
    
    // Strict protocol allowlist
    if (!['http:', 'https:', 'blob:', 'data:'].includes(parsedUrl.protocol)) {
      return "";
    }

    if (
      parsedUrl.hostname === "res.cloudinary.com" ||
      parsedUrl.hostname.endsWith(".cloudinary.com")
    ) {
      const uploadIndex = parsedUrl.pathname.indexOf("/upload/");
      if (uploadIndex !== -1) {
        const prefix = parsedUrl.pathname.substring(0, uploadIndex + 8);
        const rest = parsedUrl.pathname.substring(uploadIndex + 8);
        const segments = rest.split("/");

        // Filter out transformation segments (e.g. f_auto, q_auto, w_1200, c_scale, etc.)
        const cleanSegments = segments.filter((seg) => {
          if (!seg) return false;
          // Version segment: v followed by digits
          if (/^v\d+$/.test(seg)) return true;
          // Segment with file extension
          if (/\.[a-zA-Z0-9]+$/.test(seg)) return true;

          // Check if segment is a Cloudinary transformation parameter list
          const isTransformation =
            seg.includes(",") ||
            /^(?:[a-z]{1,4}_[a-zA-Z0-9_.:-]+)+$/i.test(seg);

          return !isTransformation;
        });

        parsedUrl.pathname = prefix + cleanSegments.join("/");
        return parsedUrl.href;
      }
    }

    return parsedUrl.href;
  } catch {
    return url;
  }
};

/**
 * Applies safe defaults for the new Event model fields (locationType, location, tags).
 * Use this wherever raw API event data is consumed so defensive checks stay in one place.
 */
export const normalizeEvent = (event) => {
  if (!event) return event;
  return {
    ...event,
    locationType: event.locationType || "Offline",
    location: event.location || "",
    tags: Array.isArray(event.tags) ? event.tags : [],
  };
};
