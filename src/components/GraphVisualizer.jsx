import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography, Button, FormControl, Alert, ButtonGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { stronglyConnectedComponents, connectedComponents, shortestPath, bipartite } from '../Algorithms/GraphAlgorithms';
import { useGraphData } from '../hooks/useGraphData';
import { useGraphVisualization } from '../hooks/useGraphVisualization';
import { IOSSwitch } from '../components/IOSSwitch';
import { Guidelines } from "./Guidelines";


export const GraphVisualizer = () => {
    const [directed, setDirected] = useState(false);
    const [algoError, setAlgoError] = useState("");
    const [showInput, setShowInput] = useState(false);
    const containerRef = useRef(null);
    const [cost, setCost] = useState(null)
    const networkRef = useRef(null);
    const [src, setSource] = useState(null);
    const [dest, setDest] = useState(null);
    const { graphData, setGraphData, nodes, edges, parseData, dataError, setEdges } = useGraphData();
    const { createNetwork, updateNetwork } = useGraphVisualization(containerRef, networkRef);

    useEffect(() => {
        parseData();
    }, [graphData]);

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

    //For Connected components,strongly connected components and bipartite graph
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
            setCost(null);

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
        console.log("Running");
        try {
            // Call the shortestPath algorithm
            const result = shortestPath(edges, nodes.length, src, dest, directed);
            console.log(result);
            // Ensure path validity and revert edges if necessary
            if (!result.path || result.path.length === 0 || result.path.length === 1 || result.cost === Infinity) {

                const updatedEdges = edges.map((edge) => {

                    return {
                        ...edge,
                        dashes: false,
                        color: "black"
                    }
                })
                setCost(null);
                updateNetwork(nodes, updatedEdges, directed);
                throw new Error('Invalid input'); // Corrected template literal
            }
            // Reset previous error message
            setAlgoError("");
            setCost(null);
            // console.log(edges);
            const updatedEdges = edges.map((edge) => {
                console.log(edge.from + "-" + edge.to);
                if (result.path.has(edge.from + "-" + edge.to)) {
                    // Highlight the edge if part of the shortest path
                    return {
                        ...edge, // Preserve other edge properties
                        dashes: true,
                        color: "red"
                    };
                } else if (!directed && result.path.has(edge.to + "-" + edge.from)) {
                    return {
                        ...edge, // Preserve other edge properties
                        dashes: true,
                        color: "red"
                    };
                } else {
                    // Revert non-path edges to default
                    return {
                        ...edge,
                        dashes: false,
                        color: "black"
                    };
                }
            });
            setCost(result.cost)
            updateNetwork(nodes, updatedEdges, directed);
            console.log(result.path); // Log the result path for debugging
            console.log(updatedEdges); // Log updated edges
        } catch (error) {
            console.error(`Error: `, error);
            setAlgoError(`Shortest path doesn't exist`);
            setTimeout(() => {
                setAlgoError("");
            }, 2000);
        }
    };

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
        <Box sx={{ display: "flex", flexDirection: "column", maxBlockSize: "100", paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}>

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
                        onChange={(e) => {
                            setGraphData(e.target.value)
                        }}
                    />
                    <div className="flex flex-row items-start">
                        {showInput && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <TextField
                                    id="standard-basic"
                                    label="Enter source and destination nodes"
                                    variant="standard"
                                    onChange={handleInput}
                                />
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    style={{ backgroundColor: "green" }}
                                    className="p-2"
                                >
                                    Run
                                </Button>
                            </div>
                        )}
                    </div>
                    {showInput && <p className="fs-6">Shortest path edges will be dashed and red colored</p>}
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

                    <Guidelines />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    {/* Existing Box with the graph visualization */}
                    <Box
                        sx={{ flex: 1, borderRadius: 2, backgroundColor: "whitesmoke", height: "600px" }}
                        className={"border border-1 shadow"}
                        ref={containerRef}

                    />

                    {/* New div placed directly under the graph visualization */}
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>  {/* You can adjust 'mt' (margin-top) as needed */}
                        {algoError && <Alert severity="error" className="float-end">{algoError}</Alert>}
                        {dataError && <Alert severity="error">{dataError}</Alert>}
                        {cost && <Alert severity="info">{`Shortest path cost is : ${cost}`}</Alert>}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
