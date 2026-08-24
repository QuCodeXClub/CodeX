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
    const parsedUrl = new URL(url);
    if (
      parsedUrl.hostname !== "res.cloudinary.com" ||
      parsedUrl.pathname.includes("/f_auto,")
    ) {
      return url;
    }
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  } catch {
    return url;
  }
};
