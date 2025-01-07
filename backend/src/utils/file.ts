const splitContent = (content: string): string[] => {
  return content.split('\n').filter((line) => line.trim() !== '');
};

export { splitContent };
