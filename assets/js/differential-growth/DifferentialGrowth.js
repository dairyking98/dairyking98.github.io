// Main Differential Growth class
class DifferentialGrowth {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    
    // Parameters
    this.maxEdgeLength = 15;
    this.minNodeDistance = 8;
    this.attractionForce = 0.01;
    this.repulsionForce = 0.05;
    this.alignmentForce = 0.02;
    this.repulsionRadius = 30;
    this.damping = 0.9;
    
    // State
    this.paths = [];
    this.allNodes = [];
    this.allEdges = [];
    this.paused = false;
    this.traceMode = false;
    this.showNodes = false;
    this.invertColors = false;
    this.debugMode = false;
    this.showFills = true;
    this.showHistory = false;
    this.showBounds = false;
    
    // History for trace mode
    this.history = [];
    this.maxHistory = 50;
    
    // Spatial index for performance
    this.spatialIndex = null;
  }

  initializePath(points) {
    const path = new Path(points);
    this.paths.push(path);
    this.allNodes.push(...path.getAllNodes());
    this.allEdges.push(...path.getAllEdges());
    this.updateSpatialIndex();
  }

  updateSpatialIndex() {
    // Simple spatial grid for now (can be optimized with rbush later)
    this.spatialIndex = new Map();
    this.allNodes.forEach(node => {
      const key = `${Math.floor(node.x / 50)}_${Math.floor(node.y / 50)}`;
      if (!this.spatialIndex.has(key)) {
        this.spatialIndex.set(key, []);
      }
      this.spatialIndex.get(key).push(node);
    });
  }

  getNearbyNodes(node, radius) {
    const candidates = [];
    const gridX = Math.floor(node.x / 50);
    const gridY = Math.floor(node.y / 50);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gridX + dx}_${gridY + dy}`;
        if (this.spatialIndex && this.spatialIndex.has(key)) {
          candidates.push(...this.spatialIndex.get(key));
        }
      }
    }
    
    return candidates.filter(n => {
      if (n === node) return false;
      const dist = node.distanceTo(n);
      return dist <= radius;
    });
  }

  update() {
    if (this.paused) return;

    // Apply forces
    this.applyForces();
    
    // Update positions
    this.updatePositions();
    
    // Split edges that are too long
    this.splitLongEdges();
    
    // Update spatial index
    this.updateSpatialIndex();
    
    // Add growth (introduce new nodes)
    this.grow();
    
    // Save history for trace mode
    if (this.traceMode || this.showHistory) {
      this.saveHistory();
    }
  }

  applyForces() {
    // Reset velocities
    this.allNodes.forEach(node => {
      node.vx = 0;
      node.vy = 0;
    });

    // Attraction to neighbors
    this.allNodes.forEach(node => {
      node.neighbors.forEach(neighbor => {
        const dx = neighbor.x - node.x;
        const dy = neighbor.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
          const force = (dist - this.maxEdgeLength * 0.7) * this.attractionForce;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      });
    });

    // Alignment (nodes want to be on straight line between neighbors)
    this.allNodes.forEach(node => {
      if (node.neighbors.length === 2) {
        const prev = node.neighbors[0];
        const next = node.neighbors[1];
        
        const midX = (prev.x + next.x) / 2;
        const midY = (prev.y + next.y) / 2;
        
        const dx = midX - node.x;
        const dy = midY - node.y;
        
        node.vx += dx * this.alignmentForce;
        node.vy += dy * this.alignmentForce;
      }
    });

    // Repulsion from nearby nodes
    this.allNodes.forEach(node => {
      const nearby = this.getNearbyNodes(node, this.repulsionRadius);
      nearby.forEach(other => {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0 && dist < this.repulsionRadius) {
          // Don't repel from neighbors (they have attraction)
          if (!node.neighbors.includes(other)) {
            const force = (this.repulsionRadius - dist) / this.repulsionRadius * this.repulsionForce;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }
      });
    });
  }

  updatePositions() {
    this.allNodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      // Apply damping
      node.vx *= this.damping;
      node.vy *= this.damping;
      
      // Keep nodes within bounds (optional)
      node.x = Math.max(10, Math.min(this.width - 10, node.x));
      node.y = Math.max(10, Math.min(this.height - 10, node.y));
    });
  }

  splitLongEdges() {
    const edgesToSplit = [];
    
    this.allEdges.forEach(edge => {
      edge.updateLength();
      if (edge.length > this.maxEdgeLength) {
        edgesToSplit.push(edge);
      }
    });

    edgesToSplit.forEach(edge => {
      const midX = (edge.nodeA.x + edge.nodeB.x) / 2;
      const midY = (edge.nodeA.y + edge.nodeB.y) / 2;
      const newNode = new Node(midX, midY);
      
      // Find which path this edge belongs to
      const path = this.paths.find(p => p.edges.includes(edge));
      if (path) {
        const nodeAIndex = path.nodes.indexOf(edge.nodeA);
        const nodeBIndex = path.nodes.indexOf(edge.nodeB);
        
        // Insert new node between nodeA and nodeB
        if (nodeAIndex !== -1 && nodeBIndex !== -1) {
          const insertIndex = Math.min(nodeAIndex, nodeBIndex) + 1;
          path.nodes.splice(insertIndex, 0, newNode);
        }
        
        path.addNode(newNode);
        this.allNodes.push(newNode);
        
        // Split the edge
        const [edgeA, edgeB] = edge.split(newNode);
        
        // Remove old edge and add new ones
        const edgeIndex = this.allEdges.indexOf(edge);
        if (edgeIndex > -1) {
          this.allEdges.splice(edgeIndex, 1);
        }
        const pathEdgeIndex = path.edges.indexOf(edge);
        if (pathEdgeIndex > -1) {
          path.edges.splice(pathEdgeIndex, 1);
        }
        
        this.allEdges.push(edgeA, edgeB);
        path.edges.push(edgeA, edgeB);
      }
    });
  }

  grow() {
    // Simple growth: occasionally add a node at a random position along a random edge
    if (Math.random() < 0.01 && this.allEdges.length > 0) {
      const edge = this.allEdges[Math.floor(Math.random() * this.allEdges.length)];
      const t = 0.3 + Math.random() * 0.4; // Add somewhere in the middle
      const x = edge.nodeA.x + (edge.nodeB.x - edge.nodeA.x) * t;
      const y = edge.nodeA.y + (edge.nodeB.y - edge.nodeA.y) * t;
      
      const newNode = new Node(x, y);
      const path = this.paths.find(p => p.edges.includes(edge));
      
      if (path) {
        const nodeAIndex = path.nodes.indexOf(edge.nodeA);
        if (nodeAIndex !== -1) {
          path.nodes.splice(nodeAIndex + 1, 0, newNode);
          path.addNode(newNode);
          this.allNodes.push(newNode);
          
          const [edgeA, edgeB] = edge.split(newNode);
          
          const edgeIndex = this.allEdges.indexOf(edge);
          if (edgeIndex > -1) {
            this.allEdges.splice(edgeIndex, 1);
          }
          const pathEdgeIndex = path.edges.indexOf(edge);
          if (pathEdgeIndex > -1) {
            path.edges.splice(pathEdgeIndex, 1);
          }
          
          this.allEdges.push(edgeA, edgeB);
          path.edges.push(edgeA, edgeB);
        }
      }
    }
  }

  saveHistory() {
    const snapshot = this.paths.map(path => ({
      nodes: path.nodes.map(n => ({ x: n.x, y: n.y }))
    }));
    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  reset(seedShape = 0) {
    this.paths = [];
    this.allNodes = [];
    this.allEdges = [];
    this.history = [];
    
    // Create initial shape based on seed
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.2;
    
    let points = [];
    switch (seedShape % 9) {
      case 0: // Circle
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
      case 1: // Triangle
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
          points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
      case 2: // Square
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
          points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
      case 3: // Line
        points = [
          { x: centerX - radius, y: centerY },
          { x: centerX + radius, y: centerY }
        ];
        break;
      case 4: // Star
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2;
          const r = i % 2 === 0 ? radius : radius * 0.5;
          points.push({
            x: centerX + Math.cos(angle) * r,
            y: centerY + Math.sin(angle) * r
          });
        }
        break;
      default:
        // Default to circle
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
    }
    
    this.initializePath(points);
  }

  exportSVG() {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}">\n`;
    
    if (this.invertColors) {
      svg += `  <rect width="${this.width}" height="${this.height}" fill="white"/>\n`;
    }
    
    this.paths.forEach(path => {
      if (path.nodes.length > 0) {
        let pathData = `M ${path.nodes[0].x} ${path.nodes[0].y}`;
        for (let i = 1; i < path.nodes.length; i++) {
          pathData += ` L ${path.nodes[i].x} ${path.nodes[i].y}`;
        }
        if (path.nodes.length > 2) {
          pathData += ' Z';
        }
        
        const fill = this.showFills ? (this.invertColors ? 'black' : 'white') : 'none';
        const stroke = this.invertColors ? 'white' : 'black';
        
        svg += `  <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>\n`;
      }
    });
    
    svg += '</svg>';
    return svg;
  }
}

