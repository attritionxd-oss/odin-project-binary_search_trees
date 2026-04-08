const splitArray = (data) => {
  return [
    data.slice(0, Math.ceil(data.length / 2)),
    data.slice(Math.ceil(data.length / 2)),
  ];
};

const merge = (left, right) => {
  const result = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
};

const mergeSort = (data) => {
  if (!data) throw new Error("ArgError: `data` missing");
  if (!Array.isArray(data))
    throw new Error("ArgError: `data` must be an array");

  const result = data;

  if (data.length <= 1) {
    return data;
  }

  const [left, right] = splitArray(data);

  return merge(mergeSort(left), mergeSort(right));
};

export default mergeSort;
