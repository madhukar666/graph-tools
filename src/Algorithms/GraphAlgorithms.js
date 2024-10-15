

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

export function dijkstra(edges, n) {

    return n;
}