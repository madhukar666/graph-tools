import { useState, useCallback } from 'react';
export const useGraphData = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [graphData, setGraphData] = useState("");
    const [dataError, setDataError] = useState("");
    const parseData = useCallback(() => {
        try {
            const lines = graphData.trim().split("\n");
            const numberOfNodes = parseInt(lines[0], 10);

            if (isNaN(numberOfNodes) || numberOfNodes <= 0) {
                throw new Error("Invalid number of nodes");
            }

            const parsedNodes = Array.from({ length: numberOfNodes }, (_, i) => ({
                id: i + 1,
                label: `${i + 1}`,
                shape: "circle",
                group: "0"
            }));

            const set = new Set();
            const parsedEdges = lines.slice(1).map(line => {
                const [from, to, label] = line.trim().split(/\s+/).map(Number);
                if (isNaN(from) || isNaN(to) || from > numberOfNodes || to > numberOfNodes) {
                    throw new Error(`Invalid edge: ${line}`);
                }// Create a unique key for the edge, irrespective of the direction (for undirected graphs)
                const edgeKey = `${from}-${to}`;
                if (set.has(edgeKey)) {
                    throw new Error(`Edge already exists between ${from} and ${to}`);
                }
                setDataError("");
                set.add(edgeKey);

                return {
                    from,
                    to,
                    label: label === undefined ? "" : label.toString(),
                    dashes: false,
                    color: "black"
                };
            });

            setNodes(parsedNodes);
            setEdges(parsedEdges);
        } catch (err) {
            // console.error(err.message);
            // setNodes([]);
            // setEdges([]);
            setDataError(err.message);
        }

    }, [graphData]);

    return { graphData, setGraphData, nodes, edges, dataError, setEdges, parseData };
};

