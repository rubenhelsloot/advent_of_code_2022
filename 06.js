const { uniq } = require("lodash");

const input = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

const findNUniqueChars = (inp, nChars) => {
  for(let i = nChars; i < inp.length; i++) {
    if (uniq(inp.slice(i - nChars, i)).length === nChars){
      return i;
    }
  }
};

console.log(findNUniqueChars('bvwbjplbgvbhsrlpgdmjqwftvncz', 4));
console.log(findNUniqueChars(input, 4));
console.log(findNUniqueChars('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 14));
console.log(findNUniqueChars(input, 14));
