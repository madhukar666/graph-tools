import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography, Button, FormControl, Alert, Select, MenuItem } from '@mui/material';
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
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const containerRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const [cost, setCost] = useState(null)
    const networkRef = useRef(null);
    const [src, setSource] = useState(null);
    const [dest, setDest] = useState(null);
    const { graphData, setGraphData, nodes, edges, parseData, dataError, setEdges } = useGraphData();
    const { createNetwork, updateNetwork } = useGraphVisualization(containerRef, networkRef);

    useEffect(() => {
        // console.log(networkRef.current);
        parseData();
    }, [graphData]);

    useEffect(() => {
        if (containerRef.current && nodes.length > 0) {
            createNetwork(nodes, edges, directed);
        }
        if (networkRef.current)
            setDisabled(false);
    }, [nodes, edges, createNetwork, directed]);

    const handleDirectedChange = (e) => {
        const value = !directed;
        setDirected(value);
        createNetwork(nodes, edges, value);
    };
    const runAlgorithm = (algorithm, algorithmName) => {
        setShowInput(false);
        try {
            const result = algorithm(edges, nodes.length, directed);
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
            setAlgoError(`${error.message}`);
            setTimeout(() => {
                setAlgoError("");
            }, 2000)
        }
    };

    const handleInput = (e) => {
        const parsedData = e.target.value.trim().split(" ").map(Number);
        setSource(parsedData[0]);
        setDest(parsedData[1]);
    }

    const handleSubmit = () => {
        setShowInput(false);
        try {
            const result = shortestPath(edges, nodes.length, src, dest, directed);
            if (!result.path || result.path.length === 0 || result.path.length === 1 || result.cost === Infinity) {
                const updatedEdges = edges.map((edge) => ({
                    ...edge,
                    dashes: false,
                    color: "black"
                }));
                setCost(null);
                updateNetwork(nodes, updatedEdges, directed);
                throw new Error('Invalid input');
            }
            setAlgoError("");
            setCost(null);
            const updatedEdges = edges.map((edge) => {
                if (result.path.has(edge.from + "-" + edge.to) || (!directed && result.path.has(edge.to + "-" + edge.from))) {
                    return {
                        ...edge,
                        dashes: true,
                        color: "red"
                    };
                } else {
                    return {
                        ...edge,
                        dashes: false,
                        color: "black"
                    };
                }
            });
            setCost(result.cost)
            updateNetwork(nodes, updatedEdges, directed);
        } catch (error) {
            // console.error(`Error: `, error);
            setAlgoError(`Shortest path doesn't exist`);
            setTimeout(() => {
                setAlgoError("");
            }, 2000);
        }
    };

    const handleAlgorithmChange = (event) => {
        const algorithm = event.target.value;
        setSelectedAlgorithm(algorithm);
        switch (algorithm) {
            case 'cc':
                runAlgorithm(connectedComponents, "Connected Components");
                break;
            case 'scc':
                runAlgorithm(stronglyConnectedComponents, "Strongly Connected Components");
                break;
            case 'dijkstra':
                setShowInput(true);
                break;
            case 'bipartite':
                runAlgorithm(bipartite, "Bipartite Graph");
                break;
            default:
                break;
        }
    };
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 48 * 4, // Adjust this value to change the maximum height
                width: 250,
            },
        },
    };


    const exportToPng = () => {
        networkRef.current.once("afterDrawing", () => {
            const canvas = networkRef.current.canvas.frame.canvas;
            const dataUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = dataUrl;
            downloadLink.download = "graph.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
        networkRef.current.redraw();
    };
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
                            setGraphData(e.target.value);
                            if (graphData === "") {
                                networkRef.current = null;
                                setDisabled(true);
                            }

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
                        <Select
                            value={selectedAlgorithm}
                            onChange={handleAlgorithmChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                        >
                            <MenuItem value="" disabled>
                                Select an algorithm
                            </MenuItem>
                            <MenuItem value="cc">Connected Components</MenuItem>
                            <MenuItem value="scc">Kosaraju Algorithm</MenuItem>
                            <MenuItem value="dijkstra">Single Source Shortest Path</MenuItem>
                            <MenuItem value="bipartite">Bipartite Graph</MenuItem>
                            {/* You can easily add more MenuItems here for new algorithms */}
                        </Select>
                    </FormControl>
                    <Button
                        onClick={exportToPng}
                        disabled={disabled}
                        variant="outlined">
                        Export as PNG
                    </Button>
                    <Guidelines />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    <Box
                        sx={{ flex: 1, borderRadius: 2, backgroundColor: "whitesmoke", height: "600px" }}
                        className={"border border-1 shadow"}
                        ref={containerRef}
                    />

                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                        {algoError && <Alert severity="error" className="float-end">{algoError}</Alert>}
                        {dataError && <Alert severity="error">{dataError}</Alert>}
                        {cost && <Alert severity="info">{`Shortest path cost is : ${cost}`}</Alert>}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}