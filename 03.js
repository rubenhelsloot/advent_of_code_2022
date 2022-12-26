const rucksacks = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`.split('\n');

const alphabet = '~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const scores = rucksacks.map((r) => {
  const compartment1 = r.substring(0, r.length / 2);
  const compartment2 = r.substring(r.length / 2);

  const match = compartment1.split('').find(l => compartment2.includes(l));

  return alphabet.indexOf(match);
});

const scores2 = [];
for (let i = 0; i < rucksacks.length; i +=3) {
  const [r1, r2, r3] = rucksacks.slice(i, i + 3);
  const badge = r1
    .split('')
    .find(l => r2.includes(l) && r3.includes(l));

  scores2.push(alphabet.indexOf(badge));
}