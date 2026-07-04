// Edge class connecting two nodes
class Edge {
  constructor(nodeA, nodeB) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.length = nodeA.distanceTo(nodeB);
  }

  updateLength() {
    this.length = this.nodeA.distanceTo(this.nodeB);
  }

  split(newNode) {
    // Create new edges
    const edgeA = new Edge(this.nodeA, newNode);
    const edgeB = new Edge(newNode, this.nodeB);

    // Update neighbor relationships
    this.nodeA.removeNeighbor(this.nodeB);
    this.nodeB.removeNeighbor(this.nodeA);

    this.nodeA.addNeighbor(newNode, edgeA);
    newNode.addNeighbor(this.nodeA, edgeA);
    newNode.addNeighbor(this.nodeB, edgeB);
    this.nodeB.addNeighbor(newNode, edgeB);

    return [edgeA, edgeB];
  }
}
