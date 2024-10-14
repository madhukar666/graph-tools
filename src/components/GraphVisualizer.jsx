import * as React from 'react';
import { useState, useCallback, useRef } from "react";
import { Box, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl, Accordion, AccordionSummary, AccordionDetails, Chip, CardMedia } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert } from '@mui/material';
export default function GraphVisualizer() {

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [graphData, setGraphData] = useState("");
    const [directed, setDirected] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState("");
    const containerRef = useRef(null);
    const networkRef = useRef(null);

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
            }));

            const parsedEdges = lines.slice(1).reduce((acc, line) => {
                const [from, to, weight] = line.trim().split(/\s+/).map(Number);
                if (isNaN(from) || isNaN(to) || from > numberOfNodes || to > numberOfNodes) {
                    throw new Error(`Invalid edge: ${line}`);
                }
                //@ts-ignore
                acc.push({ from, to, label: weight ? weight.toString() : "" });
                return acc;
            }, []);
            //@ts-ignore
            setNodes(parsedNodes);
            setEdges(parsedEdges);
            setError("");
        } catch (err) {
            //@ts-ignore
            setError(err.message);
            setNodes([]);
            setEdges([]);
        }
    }, [graphData]);

    const handleInputChange = (e) => {
        setGraphData(e.target.value);
    };
    const handleVisualize = () => {
        parseData();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '80vw',
                height: '80vh',
                marginTop: '5vh',
                m: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'white',
            }}
        >
            {/* Left Side (Graph Rendering Area) */}
            <Box sx={{ position: 'relative', width: '50%', bgcolor: '#f0f0f0' }}>
                <CardMedia
                    component="div"
                    sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#aaa' }}
                >
                    {nodes.length > 0 ? `Graph with ${nodes.length} nodes and ${edges.length} edges` : 'Graph Visualization Placeholder'}
                </CardMedia>
            </Box>

            {/* Right Side (Graph Controls) */}
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '50%' }}>
                {/* Header and Information */}
                <Box>
                    <Typography variant="h5" fontWeight="bold">Graph Visualizer</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                        <Chip label="Graph" color="success" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">Enter graph data and select the algorithm to visualize.</Typography>
                </Box>

                {/* Input Field for Graph Data */}
                <Box sx={{ my: 2 }}>
                    <TextField
                        id="input-graph"
                        label="Graph Data"
                        multiline
                        rows={4}
                        fullWidth
                        onChange={handleInputChange}
                        value={graphData}
                        variant="outlined"
                    />
                </Box>
                {
                    error && <Alert severity="error">{error}</Alert>
                }
                {/* Dropdowns for additional options (similar to algorithm selection) */}
                <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Algorithm</InputLabel>
                        <Select defaultValue="Select Algorithm">
                            <MenuItem value="CC">Connected Components</MenuItem>
                            <MenuItem value="DFS">Strongly Connected Components</MenuItem>
                            <MenuItem value="Dijkstra">Dijkstra's Algorithm</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Button to start graph visualization */}
                <Button variant="contained" color="primary" fullWidth onClick={handleVisualize}>
                    Visualize Graph
                </Button>

                {/* Accordion Section for Additional Info or FAQs */}
                <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography fontWeight="bold">Graph FAQ</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Provide information about how to enter graph data, what algorithms are available, etc.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
}
