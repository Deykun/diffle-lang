
export const getAllLineWords = (dictionary, lineLocation = 'first') => {
  const lines = dictionary.split(/\r?\n/);

  if (lineLocation === 'first') {
    const rawWords = lines.flatMap((line) => line.replace(/\s+/g,' ').split(' ')[0]).filter(Boolean).map(word => word.toLowerCase());

    return [...new Set(rawWords)];
  }
}
