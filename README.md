# theta-star
Framework-independent pathfinding algorithm Theta*.

# Installation
Copy ThetaStar.js to your code and use `<script src="ThetaStar.js"></script>` to make it visible for the code.

# Example
```
let graph = [
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1,],
  [1, 0, 0, 0, 1,],
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1,],
];
let th = new ThetaStar(graph);
let path = th.search(1, 1, 3, 4);
console.log(path);
// Expected result: {x: 1, y: 1}, {x: 0, y: 2}, {x: 3, y: 4}
```
