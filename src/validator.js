/**
 * validator.js
 * Validates node strings matching ONLY /^([A-Z])->([A-Z])$/ pattern.
 * Collects invalid_entries and duplicate_edges.
 */

const EDGE_PATTERN = /^([A-Z])->([A-Z])$/;

function validateEdges(rawEdges) {
  const valid_edges = [];
  const invalid_entries = [];
  const duplicate_edges = [];
  const seen_edges = new Set();

  rawEdges.forEach(edge => {
    const trimmedEdge = edge.trim();
    if (!EDGE_PATTERN.test(trimmedEdge)) {
      invalid_entries.push(trimmedEdge);
      return;
    }

    const [parent, child] = trimmedEdge.split('->');
    
    // Check for self-loops (even if not explicitly asked, it's good practice, 
    // but the regex allows A->A, so we'll just treat it as a valid edge 
    // unless specified otherwise. However, A->A is usually invalid in trees.)
    // The prompt says "matching ONLY pattern", so A->A matches.

    if (seen_edges.has(trimmedEdge)) {
      duplicate_edges.push(trimmedEdge);
      return;
    }

    seen_edges.add(trimmedEdge);
    valid_edges.push({ parent, child, raw: trimmedEdge });
  });

  return { valid_edges, invalid_entries, duplicate_edges };
}

module.exports = { validateEdges };
