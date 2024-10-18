
import { MinHeap } from "../datastructures/Heaps";
function dijkstra(edges, n, src, dest) {
    const adj = new Array(n + 1).fill(null).map(() => []);

    edges.forEach((edge) => {
        adj[edge.from].push({ node: edge.to, cost: edge.label === "" ? 1 : parseInt(edge.label, 10) });
    });

    const heap = new MinHeap();
    const distance = new Array(n + 1).fill(Infinity);
    distance[src] = 0;
    heap.push(0, src);
    const predecessor = new Array(n + 1).fill({ parent: -1, cost: Infinity });

    while (!heap.isEmpty()) {
        const u = heap.getTop();
        heap.pop();

        adj[u.key].forEach((v) => {
            if (distance[v.node] > u.priority + v.cost) {
                distance[v.node] = u.priority + v.cost;
                predecessor[v.node] = { parent: u.key, cost: distance[v.node] };
                heap.push(distance[v.node], v.node);
            }
        });
    }
    const path = [];
    let x = dest;
    while (x != -1) {
        console.log(x);
        path.push(x);
        x = predecessor[x].parent;
    }
    path.reverse();
    const s = new Set();

    for (let i = 0; i + 1 < path.length; i++) {
        const str = path[i] + "-" + path[i + 1];
        s.add(str);
    }
    return { path: s, cost: distance[dest] };
}


function bfs(edges, n, src, dest) {

    const adj = new Array(n + 1).fill(null).map(() => []);

    edges.forEach((edge) => {

        adj[edge.from].push({ node: edge.to, cost: edge.label === "" ? 1 : parseInt(edge.label, 10) });
        adj[edge.to].push({ node: edge.from, cost: edge.label === "" ? 1 : parseInt(edge.label, 10) });
    })
    console.log(adj);
    const queue = [];
    const distance = new Array(n + 1).fill(Infinity);
    distance[src] = 0;
    const predecessor = new Array(n + 1).fill({ parent: -1, cost: Infinity });
    queue.push({ node: src, cost: 0 });
    while (queue.length > 0) {

        const u = queue.shift();
        adj[u.node].forEach((v) => {
            if (distance[v.node] === Infinity) {
                distance[v.node] = u.cost + v.cost;
                console.log("Dist :" + distance[v.node]);
                predecessor[v.node] = { parent: u.node, cost: u.cost };
                queue.push({ node: v.node, cost: distance[v.node] });
            }
        })
    }
    const path = [];
    let x = dest;
    while (x != -1) {

        path.push(x);
        x = predecessor[x].parent;
    }
    path.reverse();
    const s = new Set();

    for (let i = 0; i + 1 < path.length; i++) {
        const str = path[i] + "-" + path[i + 1];
        s.add(str);
    }
    console.log(distance);
    return { path: s, cost: distance[dest] };
}
export function connectedComponents(edges, nodes, isdirected = false) {

    const adj = new Array(nodes + 1).fill(null).map(() => []);
    const visited = new Array(nodes + 1).fill(false);
    edges.forEach(({ from, to }) => {
        adj[from].push(to);
        if (!isdirected) adj[to].push(from);
    });
    let componentId = 0;
    let components = [];

    function dfs(i) {
        visited[i] = true;
        components.push({ id: i, label: `${i}`, group: `${componentId}` });
        adj[i].forEach(u => {
            if (!visited[u]) dfs(u);
        });
    }
    for (let i = 1; i <= nodes; i++) {
        if (!visited[i]) {
            componentId++;
            dfs(i);
        }
    }
    return components;
};

export function stronglyConnectedComponents(edges, n) {
    // Create adjacency lists for the graph and its reverse
    const graph = Array.from({ length: n + 1 }, () => []);
    const reverseGraph = Array.from({ length: n + 1 }, () => []);

    edges.forEach(({ from, to }) => {
        graph[from].push(to);
        reverseGraph[to].push(from);
    });

    const visited = new Array(n + 1).fill(false);
    const stack = [];
    let components = [];

    // First DFS to fill the stack
    function dfs1(v) {
        visited[v] = true;
        for (const w of graph[v]) {
            if (!visited[w]) dfs1(w);
        }
        stack.push(v);
    }

    // Second DFS to find SCCs
    function dfs2(v, componentId) {
        visited[v] = true;
        components.push({ id: v, label: `${v}`, group: `${componentId}` });
        for (const w of reverseGraph[v]) {
            if (!visited[w]) dfs2(w, componentId);
        }
    }

    // First pass: fill the stack
    for (let i = 1; i <= n; i++) {
        if (!visited[i]) dfs1(i);
    }

    // Reset visited array for second pass
    visited.fill(false);

    // Second pass: find SCCs
    let componentId = 0;
    while (stack.length > 0) {
        const v = stack.pop();
        if (!visited[v]) {
            componentId++;
            dfs2(v, componentId);
        }
    }

    return components;
}

export function bipartite(edges, n, directed) {


    const adj = new Array(n + 1).fill(null).map(() => []);
    edges.forEach((edge) => {
        adj[edge.from].push(edge.to);
        if (!directed) {
            adj[edge.to].push(edge.from);
        }
    });

    const color = new Array(n + 1).fill(-1);

    function dfs(node, c) {
        color[node] = c;

        for (let v of adj[node]) {  // Loop through neighbors of node
            if (color[v] === -1) {
                if (!dfs(v, 1 - c)) {  // Alternate color between 0 and 1
                    return false;  // Not bipartite
                }
            } else if (color[v] === c) {
                return false;  // Same color for adjacent nodes
            }
        }
        return true;  // Continue if no conflicts
    }

    for (let i = 1; i <= n; i++) {
        if (color[i] === -1) {
            if (!dfs(i, 0)) {
                return "Not a bipartite graph";
            }
        }
    }
    let return_value;
    for (let i = 1; i <= n; i++) {
        if (color[i] === -1) {
            return_value = dfs(i, 0);
            if (return_value === "Not a bipartite graph")
                return "Not a bipartite graph"
        }
    }
    // console.log(color);
    const nodes = [];

    for (let i = 1; i <= n; i++) {
        nodes.push({ id: i, label: `${i}`, group: `${color[i]}` });
    }
    // console.log(nodes);
    return nodes;
}
export function shortestPath(edges, n, src, dest, directed) {

    // console.log(directed);
    if (!directed) {
        const result = bfs(edges, n, src, dest);
        return result;
    }
    const result = dijkstra(edges, n, src, dest);
    return result;
}