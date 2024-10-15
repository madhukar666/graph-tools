import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography, Button, FormControl, Alert, ButtonGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { stronglyConnectedComponents, connectedComponents, dijkstra } from '../Algorithms/GraphAlgorithms';
import { useGraphData } from '../hooks/useGraphData';
import { useGraphVisualization } from '../hooks/useGraphVisualization';
import { IOSSwitch } from '../components/IOSSwitch';

const GraphVisualizer = () => {
    const [directed, setDirected] = useState(false);
    const [error, setError] = useState("");
    // console.log(directed);
    const containerRef = useRef(null);
    const networkRef = useRef(null);

    const { graphData, setGraphData, nodes, edges, parseData } = useGraphData();
    const { createNetwork, updateNetwork } = useGraphVisualization(containerRef, networkRef);

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
            const result = algorithm(edges, nodes.length, directed);
            console.log(result);
            if (!Array.isArray(result) || result.length === 0) {
                throw new Error(`Invalid result from ${algorithmName}`);
            }
            if (algorithmName === "Dijkstra Algorithm") {
                updateNetwork(result.nodes, result.edges, directed);
            } else {
                updateNetwork(result, edges, directed);
            }
        } catch (error) {
            console.error(`Error in ${algorithmName}:`, error);
            setError(`Error running ${algorithmName}: ${error.message}`);
        }
    };

    const handleConnectedComponents = () => runAlgorithm(connectedComponents, "Connected Components");
    const handleStronglyConnectedComponents = () => runAlgorithm(stronglyConnectedComponents, "Strongly Connected Components");
    const handleDijkstra = () => runAlgorithm(dijkstra, "Dijkstra Algorithm");

    const buttons = [
        <Button key="cc" onClick={handleConnectedComponents}>Connected Components</Button>,
        <Button key="scc" onClick={handleStronglyConnectedComponents}>Kosaraju Algorithm</Button>,
        <Button key="dijkstra" onClick={handleDijkstra}>Dijkstra Algorithm</Button>,
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: '100vh', width: '100vw', p: 2 }}>
            <Typography variant="h4" gutterBottom>Graph Visualizer</Typography>
            <Box sx={{ display: "flex", flex: 1, gap: 2 }}>
                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
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
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
                <Box
                    sx={{ flex: 1, borderRadius: 2, backgroundColor: "whitesmoke" }}
                    className={"border border-2 border-dark bg-dark"}
                    ref={containerRef}
                />
            </Box>
        </Box>
    );
}

export default GraphVisualizer;