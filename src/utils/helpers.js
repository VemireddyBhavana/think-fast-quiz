/**
 * Decodes HTML entities returned by the OpenTDB API
 * @param {string} html 
 * @returns {string} decoded text
 */
export const decodeHTMLEntities = (text) => {
  if (!text) return '';
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array 
 * @returns {Array} shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
