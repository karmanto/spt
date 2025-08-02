export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase()
    .trim() 
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-'); 
};

export const formatDateToYYYYMMDD = (isoString: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Invalid date string for formatting:", isoString, e);
    return '';
  }
};
