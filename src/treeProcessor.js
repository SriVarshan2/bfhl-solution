/**
 * treeProcessor.js
 * Uses Kahn's BFS topological algorithm for cycle detection.
 * Builds nested tree recursively, calculates depth.
 */

function detectCyclesKahn(nodes, adjacency) {
  const inDegree = {};
  nodes.forEach(node => inDegree[node] = 0);

  nodes.forEach(node => {
    (adjacency[node] || []).forEach(child => {
      if (inDegree[child] !== undefined) {
        inDegree[child]++;
      }
    });
  });

  const queue = [];
  nodes.forEach(node => {
    if (inDegree[node] === 0) queue.push(node);
  });

  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    count++;
    (adjacency[node] || []).forEach(child => {
      if (inDegree[child] !== undefined) {
        inDegree[child]--;
        if (inDegree[child] === 0) queue.push(child);
      }
    });
  }

  return count !== nodes.size;
}

function buildTreeRecursive(root, adjacency) {
  const children = (adjacency[root] || []).map(child => buildTreeRecursive(child, adjacency));
  return {
    node: root,
    children: children
  };
}

function calculateDepth(node) {
  if (!node.children || node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(calculateDepth));
}

module.exports = { detectCyclesKahn, buildTreeRecursive, calculateDepth };
