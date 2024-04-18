import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import NodeMinHeap, { NodeMinHeapInterface } from "../data_struct/heap";
import CommonFuncs, { Point } from "./common-func";

export default class Dijkstra {
  static visitedNodes: NodeMinHeapInterface[] = [];
  static heap: NodeMinHeap;

  static solving: boolean = false;
  static solverTimeout: number;
  static maxTimeout = 1000;
  static minTimeout = 10;

  static setSolving(solve: boolean) {
    this.solving = solve;
  }

  static setSolverSpeed(percent: number) {
    this.solverTimeout = CommonFuncs.mapFromRangeToRange(
      percent,
      { min: 10, max: 100 },
      { min: this.maxTimeout, max: this.minTimeout }
    );
  }

  static startDijkstraSearch(nodes: NodeInterface[][], startPoint: Point, setstate: Function, defaultSpeed: number) {
    // Clear the previous solution
    this.visitedNodes = [];
    this.heap = new NodeMinHeap();
    if (this.solverTimeout === undefined) this.solverTimeout = defaultSpeed;
    this.heap.insert({ x: startPoint.x, y: startPoint.y, dist: 0, prev: undefined });
    // Populate the heap with the nodes

    // Start the search
    this.setSolving(true);
    this.dijkstraSearch(nodes, startPoint, setstate);
  }

  static async dijkstraBacktrack(nodes: NodeInterface[][], x: number, y: number, setstate: Function) {
    // Function is used to backtrack from the finish to
    // the start node using the nodes with the shortest dist
    if (!this.solving) return;
    let currentNode = nodes[y][x];

    // Looping until we find the Start node
    while (currentNode.type !== PathPointType.Start) {
      // Delay for visualization
      await CommonFuncs.timeout(100);

      // Looping through the visited nodes to find the current node
      // Its needed cause the visited nodes array contains the information
      // about the previous of the current node

      for (const element of this.visitedNodes) {
        if (element.x === currentNode.x && element.y === currentNode.y) {
          // Coordinates of the previous node
          let prev_x = element.prev!.x;
          let prev_y = element.prev!.y;

          if (prev_x === currentNode.x - 1) {
            // Left adj
            nodes[prev_y][prev_x].isRightRoutePath = true;
          } else if (prev_x === currentNode.x + 1) {
            // Right adj
            currentNode.isRightRoutePath = true;
          } else if (prev_y === currentNode.y - 1) {
            // Top adj
            nodes[prev_y][prev_x].isBottomRoutePath = true;
          } else {
            // Bottom adj
            currentNode.isBottomRoutePath = true;
          }

          if (nodes[element.y][element.x].type !== PathPointType.Finish)
            nodes[element.y][element.x].type = PathPointType.RouteNode;
          setstate();
          currentNode = nodes[prev_y][prev_x];
        }
      }
    }
  }

  static async dijkstraSearch(nodes: NodeInterface[][], startPoint: { x: number; y: number }, setstate: Function) {
    if (!this.solving) return;
    // When we start the search the current node is the start node
    let currentNode = nodes[startPoint.y][startPoint.x];

    // Repeating until the finish in found
    while (this.solving) {
      // Little delay for better visualization
      await CommonFuncs.timeout(this.solverTimeout);

      // For visualization
      currentNode.visited = true;
      setstate();

      // Find the adjacent nodes
      const adjacents = this.findAdjacents(nodes, currentNode.x, currentNode.y);

      // Looping through the adjacent
      for (let adj of adjacents) {
        // If its a wall we simply skip it
        if (adj.type === PathPointType.Wall) continue;

        let distanceBetweenNodes: number;
        if (adj.x === currentNode.x - 1) distanceBetweenNodes = adj.rightRouteWeight;
        else if (adj.x === currentNode.x + 1) distanceBetweenNodes = currentNode.rightRouteWeight;
        else if (adj.y === currentNode.y - 1) distanceBetweenNodes = adj.bottomRouteWeight;
        else distanceBetweenNodes = currentNode.bottomRouteWeight;

        let newDist = distanceBetweenNodes + this.heap.arr[0].dist;
        // Finding the index of the adjacents node in the Heap
        let adjHeapIndex = this.heap.findByCoords(adj.x, adj.y);
        if (adjHeapIndex === -1) {
          if (!adj.visited)
            this.heap.insert({ x: adj.x, y: adj.y, dist: newDist, prev: { x: currentNode.x, y: currentNode.y } });
        } else if (distanceBetweenNodes + this.heap.arr[0].dist < this.heap.arr[adjHeapIndex].dist) {
          this.heap.arr[adjHeapIndex].prev = { x: currentNode.x, y: currentNode.y };
          this.heap.decreaseKey(adjHeapIndex, distanceBetweenNodes + this.heap.arr[0].dist);
        }
      }

      console.log(this.heap.arr);
      // After we looped through all the adjacents, we remove the current node
      // from the Heap and add it to the list of the visited nodes
      let min = this.heap.extractMin();
      this.visitedNodes.push(min!);

      // If the current node is the Finish Node we stop the loop and start
      // backtracking to the Start Node to find the shortest path
      if (currentNode.type === PathPointType.Finish) {
        console.log("Finish found");
        this.dijkstraBacktrack(nodes, currentNode.x, currentNode.y, setstate);
        return;
      }

      // If the current node isn't the Finish Node we set the current node to
      // the first one in the Heap and continue the search on that one
      const min_node = this.heap.getMin();
      currentNode = nodes[min_node.y][min_node.x];
    }
  }

  static findAdjacents(nodes: NodeInterface[][], base_x: number, base_y: number) {
    let adjacents: NodeInterface[] = [];
    const directions = [
      { dy: 0, dx: -1 }, // Left
      { dy: 0, dx: 1 }, // Right
      { dy: -1, dx: 0 }, // Up
      { dy: 1, dx: 0 }, // Down
    ];

    for (const dir of directions) {
      const ny = base_y + dir.dy;
      const nx = base_x + dir.dx;

      if (ny >= 0 && ny < nodes.length && nx >= 0 && nx < nodes[ny].length && nodes[ny][nx]) {
        adjacents.push(nodes[ny][nx]);
      }
    }
    return adjacents;
  }
}
