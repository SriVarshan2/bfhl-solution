const express = require('express');
const cors = require('cors');
const { validateEdges } = require('./src/validator');
const { buildGraph, groupNodes } = require('./src/graphBuilder');
const { detectCyclesKahn, buildTreeRecursive, calculateDepth } = require('./src/treeProcessor');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html

const PORT = process.env.PORT || 3000;

app.post('/bfhl', (req, res) => {
  try {
    const { nodes } = req.body;
    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({ error: "Invalid input. 'nodes' array is required." });
    }

    const { valid_edges, invalid_entries, duplicate_edges } = validateEdges(nodes);
    const { adjacency, allNodes, parentMap } = buildGraph(valid_edges);
    const components = groupNodes(allNodes, adjacency);

    const hierarchies = [];
    let total_cycles = 0;
    let total_trees = 0;
    let trees = [];

    components.forEach(nodeSet => {
      const hasCycle = detectCyclesKahn(nodeSet, adjacency);
      if (hasCycle) {
        total_cycles++;
        hierarchies.push({
          type: "cycle",
          nodes: Array.from(nodeSet).sort()
        });
      } else {
        // Find the root of the tree (node with no parent in this component)
        const root = Array.from(nodeSet).find(node => !parentMap[node]);
        if (root) {
          total_trees++;
          const tree = buildTreeRecursive(root, adjacency);
          const depth = calculateDepth(tree);
          const treeObj = {
            type: "tree",
            root: root,
            depth: depth,
            tree: tree
          };
          hierarchies.push(treeObj);
          trees.push(treeObj);
        }
      }
    });

    // Largest tree root (tiebreak by lexicographic order)
    let largest_tree_root = "";
    if (trees.length > 0) {
      trees.sort((a, b) => {
        if (b.depth !== a.depth) return b.depth - a.depth;
        return a.root.localeCompare(b.root);
      });
      largest_tree_root = trees[0].root;
    }

    const response = {
      user_id: "ssrivarshan_04012006",
      email_id: "ss9174@sermist.edu.in",
      college_roll_number: "RA2311026010762",
      hierarchies: hierarchies,
      invalid_entries: invalid_entries,
      duplicate_edges: duplicate_edges,
      summary: {
        total_trees: total_trees,
        total_cycles: total_cycles,
        largest_tree_root: largest_tree_root
      }
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
