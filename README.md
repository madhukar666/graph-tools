# Graph Visualization and Algorithm Tool
<video width="640" height="360" autoplay>
  <source src= "https://drive.google.com/file/d/16egTKQpJcJgaaqUNU6tB2yaIUvTY2sLk/view?usp=drive_link" type="video/webm">
  Your browser does not support the video tag.
</video>
## Overview

This web application allows users to input graph data (nodes and edges), visualize the resulting graph, and see the results of various graph algorithms applied to their input.

## Features

- **Graph Input**: Users can enter node and edge data to define their graph.
- **Graph Visualization**: The entered graph is rendered visually using a force-directed layout.
- **Algorithm Visualization**: Users can select from a variety of graph algorithms to visualize their results on the graph.
  
## Supported Algorithms

- Single Source Shortest Path Algorithm
- Connected Components
- Strongly Connected Components(Kosaraju's algorithm)
- Bipartite graph

## Getting Started

1. Visit the website at [https://visualgraph.netlify.app](https://visualgraph.netlify.app)
2. Use the input form to enter your graph data (see Input Format below)
4. Select an algorithm from the menu

## Input Format

### Unweighted Graphs

For unweighted graphs, each edge is represented by two numbers: the "from" node and the "to" node.

Format:
```
from to
```

Example:
```
1 2
2 4
3 1
4 3
```

### Weighted Graphs

For weighted graphs, each edge is represented by three numbers: the "from" node, the "to" node, and the weight of the edge.

Format:
```
from to weight
```

Example:
```
1 2 4
2 4 2
3 1 5
4 3 3
```

## Technical Stack

- Frontend: React.js with vis.js for visualizations
- Graph Algorithms: Implementation in JavaScript

Happy graphing!
