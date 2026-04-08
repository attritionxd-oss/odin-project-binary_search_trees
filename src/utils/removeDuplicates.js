const removeDuplicates = (data) => {
  if (!data || data.length < 1) return;
  const result = new Set(data);
  return [...result];
};

export default removeDuplicates;
