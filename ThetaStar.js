class ThetaStar {
  _graph; // PathfindingNode[][]
  _openNodes;
  _closedNodes;
  _tileSize;

  /**
   * Construct the Theta* searching object.
   * 
   * @param {integer[][]} graph 2D array of numbers. Currently, 0 means "not walkable", anything else means "walkable".
   * @param {integer} tileSize Size of tiles in the graph/grid.
   * @param {integer} collisionFreeNumber Denotes which value should be considered "walkable".
   */
  constructor(graph /* 2d array of numbers */, tileSize, collisionFreeNumber) {
    this._tileSize = tileSize;
    this._graph = [];
    for(let i = 0; i < graph.length; i++) {
      this._graph.push([]);
      for(let ii = 0; ii < graph[i].length; ii++) {
        this._graph[i].push(new PathfindingNode(ii, i, graph[i][ii] === collisionFreeNumber));
      }
    }
  }

  /**
   * Searches for the shortest path in the graph.
   * 
   * @param {integer} x1 
   * @param {integer} y1 
   * @param {integer} x2 
   * @param {integer} y2 
   * @returns List of coordinates describing the resulting path, including the starting and ending point.
   */
  search(x1, y1, x2, y2) {
    this._openNodes = [];
    this._closedNodes = [];

    const startNode = this._getNode(Math.floor(x1 / this._tileSize), Math.floor(y1 / this._tileSize));
    const targetNode = this._getNode(Math.floor(x2 / this._tileSize), Math.floor(y2 / this._tileSize));
    startNode.g = 0;
    startNode.parent = startNode;
    this._openNodes.push(startNode);
    while(this._openNodes.length > 0) {
      let currentNode = this._getBestNode(this._openNodes);
      this._openNodes.splice(this._openNodes.indexOf(currentNode), 1);
      this._closedNodes.push(currentNode);
      if(currentNode === targetNode) {
        // Reached target node, return resulting path
        let finalPath = this._reconstructPath(currentNode);
        this._cleanup();
        return finalPath;
      }
      let neighbors = this._getNeighbors(currentNode);
      for(let n = 0; n < neighbors.length; n++) {
        if(this._closedNodes.includes(neighbors[n])) {
          continue;
        }
        this._updateVertex(currentNode, neighbors[n], targetNode);
      }
    }
    this._cleanup();
    return null;
  }

  /**
   * 
   * @param {PathfindingNode} currentNode 
   * @param {PathfindingNode} neighbor 
   * @param {PathfindingNode} targetNode 
   */
  _updateVertex(currentNode, neighbor, targetNode) {
    let calcNode = currentNode;
    if(this._lineOfSight(currentNode.parent, neighbor)) {
      calcNode = currentNode.parent;
    }
    const newDist = calcNode.g + this._getDistance(calcNode, neighbor);
    if(newDist < neighbor.g) {
      neighbor.g = newDist;
      neighbor.h = this._getDistance(neighbor, targetNode);
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.parent = calcNode;
      if(!this._openNodes.includes(neighbor)) {
        this._openNodes.push(neighbor);
      }
    }
  }

  /**
   * Uses Bresenham's line algorithm but instead of drawing pixels, it checks if those pixels exist AND are walkable.
   * Good explanation of the algorithm is here: https://www.baeldung.com/cs/bresenhams-line-algorithm
   * 
   * @param {PathfindingNode} node1 
   * @param {PathfindingNode} node2 
   * @returns {boolean} True if the line of sight exist, false otherwise.
   */
  _lineOfSight(node1, node2) {
    let x0 = node1.x;
    let y0 = node1.y;
    let x1 = node2.x;
    let y1 = node2.y;
    let dx = Math.abs(x1 - x0);
    let dy = -Math.abs(y1 - y0);

    let sX = -1;
    let sY = -1;
    if(x0 < x1) {
      sX = 1;
    }
    if(y0 < y1) {
      sY = 1;
    }

    let e = dx + dy;
    while(true) {
      let point = this._getNode(x0, y0);
      if(!point || !point.walkable) {
        return false;
      }
      if(x0 === x1 && y0 === y1) {
        return true;
      }
      let e2 = 2 * e;
      if(e2 >= dy) {
        if(x0 === x1) {
          return true;
        }
        e += dy;
        x0 += sX;
      }
      if(e2 <= dx) {
        if(y0 === y1) {
          return true;
        }
        e += dx;
        y0 += sY;
      }
    }
  }

  _reconstructPath(destinationNode) {
    let path = [];
    let node = destinationNode;
    while(node.parent !== node) {
      path.unshift({
        x: node.x * this._tileSize,
        y: node.y * this._tileSize,
      });
      node = node.parent;
    }
    path.unshift({
      x: node.x * this._tileSize,
      y: node.y * this._tileSize,
    });
    return path;
  }

  _cleanup() {
    for(let i = 0; i < this._openNodes.length; i++) {
      this._openNodes[i].reset();
    }
    for(let i = 0; i < this._closedNodes.length; i++) {
      this._closedNodes[i].reset();
    }
  }

  _compareNodes(nodeA, nodeB) {
    if(nodeA.f === nodeB.f) {
      return nodeA.h - nodeB.h;
    }
    return nodeA.f - nodeB.f;
  }

  _getBestNode(nodes) {
    let best = nodes[0];
    for(let i = 1; i < nodes.length; i++) {
      if(this._compareNodes(nodes[i], best) < 0) {
        best = nodes[i];
      }
    }
    return best;
  }

  _getDistance(node1, node2) {
    return Math.sqrt((node2.x - node1.x) * (node2.x - node1.x) + (node2.y - node1.y) * (node2.y - node1.y));
  }

  _getNeighbors(node) {
    let nodes = [];
    let coords = [
      {x: node.x - 1, y: node.y - 1},
      {x: node.x, y: node.y - 1},
      {x: node.x + 1, y: node.y - 1},
      {x: node.x - 1, y: node.y},
      {x: node.x + 1, y: node.y},
      {x: node.x - 1, y: node.y + 1},
      {x: node.x, y: node.y + 1},
      {x: node.x + 1, y: node.y + 1},
    ];
    for(let i = 0; i < coords.length; i++) {
      let node = this._getNode(coords[i].x, coords[i].y);
      if(node && node.walkable) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  _getNode(x, y) {
    if(x < 0 || y < 0 || x >= this._graph[0].length || y >= this._graph.length) {
      return null;
    }
    return this._graph[y][x];
  }
}

class PathfindingNode {
  x;
  y;
  g;
  h;
  f;
  parent;
  walkable;

  constructor(x, y, walkable) {
    this.x = x;
    this.y = y;
    this.walkable = walkable;
    this.reset();
  }

  reset() {
    this.g = Infinity;
    this.h = Infinity;
    this.f = Infinity;
    this.parent = null;
  }
}
