const sum_to_n_a = function (n) {
  // your code here
  let sum = 0;
  if (n >= 0) {
    for (let i = 0; i <= n; i++) {
      sum += i;
    }
  } else {
    for (let i = 0; i >= n; i--) {
      sum += i;
    }
  }

  return sum;
};

const sum_to_n_b = function (n) {
  // your code here
  const array = Array.from(Array(Math.abs(n) + 1).keys());

  return array.reduce((sum, cur) => (n >= 0 ? (sum += cur) : (sum -= cur)));
};

const sum_to_n_c = function (n) {
  // your code here
  const array = Array.from(Array(Math.abs(n) + 1).keys());
  let sum = 0;

  array.forEach((i) => (n >= 0 ? (sum += i) : (sum -= i)));

  return sum;
};
