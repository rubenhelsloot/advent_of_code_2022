const { sortBy } = require('lodash');

const input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`.split("\n");

let cd = "/";
const directDirSizes = { "/": 0 };

input.forEach((row) => {
  if (row[0] !== "$") {
    const [sizeOrDir, name] = row.split(" ");
    if (sizeOrDir === "dir") return;
    directDirSizes[cd] += Number(sizeOrDir);
    return;
  }

  const [cmd, goTo] = row.substring(2).split(" ");
  if (cmd === "ls") return;

  if (goTo === "/") {
    cd = "/";
    return;
  }

  if (goTo === "..") {
    cd = cd.split("/").slice(0, -1).join("/");
    return;
  }

  cd += (cd.endsWith("/") ? "" : "/") + goTo;

  // Register the directory
  directDirSizes[cd] = 0;
});

const dirs = Object.keys(directDirSizes).sort();
const dirSizes = Object.entries(directDirSizes).map(([path, size]) => ({
  path,
  size,
}));

const indirectDirSizes = dirs.map((dir) => {
  const indirectSize = dirSizes
    .filter(({ path }) => path.startsWith(dir))
    .map(({ size }) => size)
    .reduce((s, v) => s + v, 0);

  return { path: dir, indirectSize };
});

const result1 = indirectDirSizes
  .filter(({ indirectSize }) => indirectSize <= 100_000)
  .reduce((s, { indirectSize }) => s + indirectSize, 0);
console.log(result1);

const FREE_SPACE = 70_000_000 - indirectDirSizes.find(({ path }) => path === '/').indirectSize;
const REQUIRED_SPACE = 30_000_000;
const missing = REQUIRED_SPACE - FREE_SPACE;

const result2 = sortBy(indirectDirSizes, 'indirectSize').find(({ indirectSize }) => indirectSize >= missing);
console.log(result2);