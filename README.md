# theta-star
Framework-independent pathfinding algorithm Theta*. Theta* is an any-angle path planning algorithm that is based on the A* search algorithm. It can find near-optimal paths with run times comparable to those of A*.

Searches for the shortest path in the graph.
How the algorithm works is explained here:
- https://en.wikipedia.org/wiki/Theta*
- https://arxiv.org/pdf/1401.3843.pdf (Please note, that their line-of-sight function does not work. The line-of-sight algorithm is from here: https://www.baeldung.com/cs/bresenhams-line-algorithm)

# Installation
Copy `ThetaStar.js` to your code and make it useable by `<script src="ThetaStar.js"></script>`.

# Example
```javascript
let graph = [
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1,],
  [1, 0, 0, 0, 1,],
  [1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1,],
];
let th = new ThetaStar(graph, 1, 1);
let path = th.search(1, 1, 3, 4);

console.log(path);
// Expected result: [{x: 1, y: 1}, {x: 0, y: 2}, {x: 3, y: 4}]
```
