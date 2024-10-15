import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography, Button, FormControl, Alert, ButtonGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { stronglyConnectedComponents, connectedComponents, shortestPath, bipartite } from '../Algorithms/GraphAlgorithms';
import { useGraphData } from '../hooks/useGraphData';
import { useGraphVisualization } from '../hooks/useGraphVisualization';
import { IOSSwitch } from '../components/IOSSwitch';
import { Guidelines } from "./Guidelines";


const GraphVisualizer = () => {
    const [directed, setDirected] = useState(false);
    const [algoError, setAlgoError] = useState("");
    const [showInput, setShowInput] = useState(false);
    const containerRef = useRef(null);
    const networkRef = useRef(null);
    const [src, setSource] = useState(null);
    const [dest, setDest] = useState(null);
    const { graphData, setGraphData, nodes, edges, parseData, dataError, setEdges } = useGraphData();
    const { createNetwork, updateNetwork } = useGraphVisualization(containerRef, networkRef);
    const [prevEdges, setPrevEdges] = useState(null);
    useEffect(() => {
        parseData();
    }, [parseData]);

    useEffect(() => {
        if (containerRef.current && nodes.length > 0) {
            createNetwork(nodes, edges, directed);
        }
    }, [nodes, edges, createNetwork, directed]);

    const handleDirectedChange = (e) => {
        const value = !directed;
        setDirected(value);
        createNetwork(nodes, edges, value);
    };

    const runAlgorithm = (algorithm, algorithmName) => {
        try {
            // console.log(edges);
            const result = algorithm(edges, nodes.length, directed);
            // console.log(result);
            if (!Array.isArray(result) || result.length === 0) {
                if (result === "Not a bipartite graph")
                    throw new Error(result);
                else
                    throw new Error(`Invalid result from ${algorithmName}`);
            }
            setAlgoError("")
            if (prevEdges !== null)
                setEdges(prevEdges)
            updateNetwork(result, edges, directed);
        } catch (error) {
            // console.error(`Error in ${algorithmName}:`, error);
            setAlgoError(`${error.message}`);
            setTimeout(() => {
                setAlgoError("");
            }, 2000)
        }
    };
    const handleInput = (e) => {
        const parsedData = e.target.value.trim().split(" ").map(Number);
        // console.log(parsedData);
        setSource(parsedData[0]);
        setDest(parsedData[1]);
    }
    const handleSubmit = () => {
        setShowInput(false);

        try {
            const result = shortestPath(edges, nodes.length, src, dest, directed);
            if (result.set.size === 0 || result.set.size === 1) {
                if (prevEdges !== null) {
                    setEdges(prevEdges);
                    setPrevEdges(null);
                }
                throw new Error(`Invalid input}`);
            }
            setAlgoError("");
            setPrevEdges(edges);
            edges.forEach((edge) => {
                if (result.set.has(edge.from) && result.set.has(edge.to)) {
                    edge.dashes = true;
                    edge.color = "red"
                }
                else {
                    edge.dashes = false;
                    edge.color = "black"
                }
            });
            // console.log(edges);
            updateNetwork(nodes, edges, directed);
        } catch (error) {
            console.error(`Error : `, error);
            setAlgoError(`Shortest path doesn't exist`);
            console.log(algoError)
            setTimeout(() => {
                setAlgoError("");
            }, 2000)
        }
    }
    const handleConnectedComponents = () => runAlgorithm(connectedComponents, "Connected Components");
    const handleStronglyConnectedComponents = () => runAlgorithm(stronglyConnectedComponents, "Strongly Connected Components");
    const handleDijkstra = () => { setShowInput(true) };
    const handleBipartite = () => { runAlgorithm(bipartite, "Bipartite Graph") }
    const buttons = [
        <Button key="cc" onClick={handleConnectedComponents}>Connected Components</Button>,
        <Button key="scc" onClick={handleStronglyConnectedComponents}>Kosaraju Algorithm</Button>,
        <Button key="dijkstra" onClick={handleDijkstra}>Single Source Shortest Path</Button>,
        <Button key="bipartite-graph" onClick={handleBipartite}>Bipartite Graph</Button>
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Box className="text-center" sx={{ display: "flex", flex: 1, gap: 2 }}>
                <Typography variant="h4" gutterBottom className="text-light-emphasis">Graph Visualizer</Typography>
            </Box>
            <Box sx={{ display: "flex", flex: 1, gap: 2 }}>
                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }} className="border rounded border-1 shadow p-5">
                    <FormControlLabel className="text-center"
                        control={<IOSSwitch checked={directed} onChange={handleDirectedChange} />}
                        label={directed ? "Directed Graph" : "Undirected Graph"}
                    />
                    <TextField
                        label="Graph Data"
                        multiline
                        rows={10}
                        fullWidth
                        variant="outlined"
                        value={graphData}
                        onChange={(e) => setGraphData(e.target.value)}
                    />
                    {showInput && (
                        <div className="flex flex-row items-center space-x-4">
                            <TextField id="standard-basic" label="Enter source and destination nodes" variant="standard" onChange={(e) => { handleInput(e) }} />
                            <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: "green" }} className="p-2 m-5 bg-primary">
                                Run
                            </Button>
                            <p>Shortest path edges will be dashed and red colored</p>
                        </div>
                    )}

                    <FormControl fullWidth>
                        <ButtonGroup
                            orientation="vertical"
                            aria-label="Vertical button group"
                            variant="contained"
                            className="mt-2"
                        >
                            {buttons}
                        </ButtonGroup>
                    </FormControl>
                    {algoError && <Alert severity="error" className="float-end">{algoError}</Alert>}
                    {dataError && <Alert severity="error">{dataError}</Alert>}
                    <Guidelines />
                </Box>

                <Box
                    sx={{ flex: 1, borderRadius: 2, backgroundColor: "whitesmoke" }}
                    className={"border border-1 shadow"}
                    ref={containerRef}
                />
            </Box>
        </Box>
    );
}

export default GraphVisualizer;