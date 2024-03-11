
export const getAllLineWords = (dictionary, lineLocation = 'first') => {
  const lines = dictionary.split(/\r?\n/);

  let rawWords = [];

  if (lineLocation === 'first') {
    rawWords = lines.flatMap((line) => line.trim().replace(/\s+/g,' ').split(' ')[0])
  }

  if (lineLocation === 'all') {
    rawWords = lines.flatMap((line) => line.trim().replace(/\s+/g,' ').split(' '));
  }

  const processedWords = rawWords.filter(Boolean).map(word => word.toLowerCase());

  return [...new Set(processedWords)];
}
