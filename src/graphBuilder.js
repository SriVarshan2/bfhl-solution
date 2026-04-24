/**
 * graphBuilder.js
 * Builds adjacency list where first parent wins in diamond cases.
 * Groups nodes using iterative DFS.
 */

function buildGraph(validEdges) {
  const adjacency = {};
  const allNodes = new Set();
  const parentMap = {}; // child -> parent

  validEdges.forEach(({ parent, child }) => {
    allNodes.add(parent);
    allNodes.add(child);

    if (!adjacency[parent]) adjacency[parent] = [];
    
    // First parent wins logic: Only add child to adjacency if it doesn't have a parent yet
    // or if the logic is to build the full graph and then process? 
    // The prompt says "adjacency list where first parent wins in diamond cases".
    // This usually means if a child is encountered again, we ignore the subsequent parent links.
    
    if (!parentMap[child]) {
      parentMap[child] = parent;
      adjacency[parent].push(child);
    }
  });

  return { adjacency, allNodes, parentMap };
}

function groupNodes(allNodes, adjacency) {
  const visited = new Set();
  const components = [];

  // Create an undirected version for grouping
  const undirected = {};
  allNodes.forEach(node => undirected[node] = []);
  
  Object.keys(adjacency).forEach(parent => {
    adjacency[parent].forEach(child => {
      undirected[parent].push(child);
      undirected[child].push(parent);
    });
  });

  allNodes.forEach(startNode => {
    if (!visited.has(startNode)) {
      const component = new Set();
      const stack = [startNode];

      while (stack.length > 0) {
        const node = stack.pop();
        if (!visited.has(node)) {
          visited.add(node);
          component.add(node);
          (undirected[node] || []).forEach(neighbor => {
            if (!visited.has(neighbor)) stack.push(neighbor);
          });
        }
      }
      components.push(component);
    }
  });

  return components;
}

module.exports = { buildGraph, groupNodes };
