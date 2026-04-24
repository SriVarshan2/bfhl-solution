# 🌐 BFHL Full Stack Engineering Challenge

<div align="center">

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-blue)

**A production-ready REST API that intelligently processes hierarchical node relationships,
detects cycles, and returns structured insights — with a sleek interactive frontend.**

[🚀 Live Demo](https://bfhl-solution-opal.vercel.app) • [📡 API](https://bfhl-solution-opal.vercel.app/bfhl) • [💻 GitHub](https://github.com/SriVarshan2/bfhl-solution)

</div>

---

## 📌 About This Project

This project was built for the **SRM Full Stack Engineering Challenge (Round 1)**.

The challenge required building a REST API that:
- Accepts an array of node strings like `A->B`, `B->C`
- Parses and validates each entry
- Constructs hierarchical trees
- Detects cyclic groups
- Returns a fully structured JSON response

Along with the API, a clean and interactive **single-page frontend** was built to let users test the API visually in real time.

---

## ✨ Features

- 🔗 Parses node strings and builds tree structures
- 🌲 Supports multiple independent trees in one request
- 🔄 Detects and reports cyclic node groups
- ❌ Identifies invalid entries and duplicate edges
- 💎 Diamond/multi-parent conflict resolution
- 📊 Returns depth, summary, and hierarchy for every tree
- 🎨 Beautiful and responsive frontend UI
- ⚡ Responds in under 3 seconds for up to 50 nodes
- 🌍 CORS enabled for cross-origin API calls

---

## 🚀 Live Demo

| Type | URL |
|------|-----|
| 🖥️ Frontend | https://bfhl-solution-opal.vercel.app |
| 📡 Backend API | https://bfhl-solution-opal.vercel.app/bfhl |
| 💻 GitHub Repo | https://github.com/SriVarshan2/bfhl-solution |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                    │
│                                                      │
│   ┌──────────────────────────────────────────────┐  │
│   │            index.html (Frontend)             │  │
│   │   • Input textarea for node strings          │  │
│   │   • Analyze Graph button                     │  │
│   │   • Structured result display                │  │
│   └──────────────────┬───────────────────────────┘  │
└──────────────────────┼──────────────────────────────┘
                       │ POST /bfhl
                       │ Content-Type: application/json
                       ▼
┌─────────────────────────────────────────────────────┐
│                  VERCEL SERVERLESS                   │
│                                                      │
│   ┌──────────────────────────────────────────────┐  │
│   │              index.js (Backend)              │  │
│   │                                              │  │
│   │   ┌─────────────┐   ┌────────────────────┐  │  │
│   │   │  validator  │   │   graphBuilder     │  │  │
│   │   │    .js      │──▶│       .js          │  │  │
│   │   │             │   │                    │  │  │
│   │   │ • Validates │   │ • Builds adjacency │  │  │
│   │   │   format    │   │   list             │  │  │
│   │   │ • Detects   │   │ • Finds roots      │  │  │
│   │   │   invalids  │   │ • Groups nodes     │  │  │
│   │   │ • Removes   │   └────────┬───────────┘  │  │
│   │   │   dupes     │            │               │  │
│   │   └─────────────┘            ▼               │  │
│   │                   ┌────────────────────┐     │  │
│   │                   │  treeProcessor.js  │     │  │
│   │                   │                    │     │  │
│   │                   │ • Builds tree      │     │  │
│   │                   │ • Detects cycles   │     │  │
│   │                   │ • Calculates depth │     │  │
│   │                   │ • Builds summary   │     │  │
│   │                   └────────┬───────────┘     │  │
│   └────────────────────────────┼─────────────────┘  │
└────────────────────────────────┼────────────────────┘
                                 │ JSON Response
                                 ▼
                        CLIENT RECEIVES
                        structured result
```

---

## 🔄 How It Works

### Step 1 — Input
User enters node strings separated by commas in the frontend textarea:
```
A->B, A->C, B->D, X->Y, Y->Z, Z->X, hello, 1->2
```

### Step 2 — Validation
Each entry is validated against the rule: **single uppercase letter → single uppercase letter**
- ✅ Valid: `A->B`, `X->Y`
- ❌ Invalid: `hello`, `1->2`, `AB->C`, `A->A`, `A->`

### Step 3 — Duplicate Detection
If the same edge appears more than once, only the first is used. Rest go to `duplicate_edges`.

### Step 4 — Graph Building
Valid edges are used to build an adjacency list. Roots are nodes that never appear as a child.

### Step 5 — Cycle Detection
DFS traversal detects if any group contains a cycle. Cyclic groups get `has_cycle: true` and `tree: {}`.

### Step 6 — Tree Construction
Non-cyclic groups are recursively built into nested tree objects with depth calculation.

### Step 7 — Response
A fully structured JSON response is returned with all hierarchies, invalid entries, duplicates, and summary.

---

## 🗺️ Workflow Flowchart

```
                    ┌─────────────┐
                    │  User Input │
                    │  via UI     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  POST /bfhl │
                    │  API Call   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Parse &    │
                    │  Split Data │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐       ┌──────────────────┐
                    │  Validate   │──NO──▶│ Add to           │
                    │  Format     │       │ invalid_entries  │
                    │  X->Y ?     │       └──────────────────┘
                    └──────┬──────┘
                           │ YES
                           ▼
                    ┌─────────────┐       ┌──────────────────┐
                    │  Duplicate  │──YES─▶│ Add to           │
                    │  Edge ?     │       │ duplicate_edges  │
                    └──────┬──────┘       └──────────────────┘
                           │ NO
                           ▼
                    ┌─────────────┐
                    │  Build      │
                    │  Graph      │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐       ┌──────────────────┐
                    │  Cycle      │──YES─▶│ has_cycle: true  │
                    │  Detected ? │       │ tree: {}         │
                    └──────┬──────┘       └──────────────────┘
                           │ NO
                           ▼
                    ┌─────────────┐
                    │  Build Tree │
                    │  + Depth    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Build      │
                    │  Summary    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Return     │
                    │  JSON       │
                    └─────────────┘
```

---

## 📁 Project Structure

```
bfhl-solution/
│
├── index.js              # Express server + POST /bfhl route
├── index.html            # Frontend single page app
├── vercel.json           # Vercel deployment config
├── package.json          # Node dependencies
│
└── src/
    ├── validator.js      # Input validation logic
    ├── graphBuilder.js   # Graph construction logic
    └── treeProcessor.js  # Tree building + cycle detection
```

---

## 📡 API Reference

### `POST /bfhl`

**Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello", "1->2"]
}
```

**Response**
```json
{
  "user_id": "srivarshan_ddmmyyyy",
  "email_id": "your@srm.edu.in",
  "college_roll_number": "RAXXXXXXXXXXXXX",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": {} } },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": ["hello", "1->2"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js | Server-side JavaScript |
| Framework | Express.js | REST API routing |
| Frontend | HTML + CSS + JS | Interactive UI |
| Hosting | Vercel | Serverless deployment |
| Version Control | GitHub | Code repository |

---

## ⚙️ Processing Rules Summary

| Rule | Detail |
|------|--------|
| Valid Format | `X->Y` — single uppercase letters only |
| Invalid Entries | `hello`, `1->2`, `AB->C`, `A->A`, `A->` |
| Duplicate Edges | First occurrence used, rest in `duplicate_edges` |
| Cycle Detection | DFS — returns `has_cycle: true`, `tree: {}` |
| Multi-parent | First parent edge wins, others discarded |
| Depth | Number of nodes on longest root-to-leaf path |
| Largest Tree | By depth — lexicographic tiebreaker |

---

## 🏃 Run Locally

```bash
# Clone the repo
git clone https://github.com/SriVarshan2/bfhl-solution.git

# Navigate into folder
cd bfhl-solution

# Install dependencies
npm install

# Start the server
node index.js
```

Open **http://localhost:3002** in your browser ✅

---

## 🧪 Test the API

```bash
curl -X POST https://bfhl-solution-opal.vercel.app/bfhl \
-H "Content-Type: application/json" \
-d '{"data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello", "1->2"]}'
```

---

<div align="center">

Made with ❤️ for SRM Full Stack Engineering Challenge

⭐ Star this repo if you found it useful!

</div>
