import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography, Button, FormControl, Alert, ButtonGroup, useMediaQuery } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { stronglyConnectedComponents, connectedComponents, shortestPath, bipartite } from '../Algorithms/GraphAlgorithms';
import { useGraphData } from '../hooks/useGraphData';
import { useGraphVisualization } from '../hooks/useGraphVisualization';
import { IOSSwitch } from '../components/IOSSwitch';
import { Guidelines } from "./Guidelines";
import { VideoComponent } from "./VideoComponent"

const GraphVisualizer = () => {
  const [directed, setDirected] = useState(false);
  const [algoError, setAlgoError] = useState("");
  const [showInput, setShowInput] = useState(false);
  const containerRef = useRef(null);
  const [cost, setCost] = useState(null);
  const networkRef = useRef(null);
  const [src, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  const { graphData, setGraphData, nodes, edges, parseData, dataError, setEdges } = useGraphData();
  const { createNetwork, updateNetwork } = useGraphVisualization(containerRef, networkRef);
  const [prevEdges, setPrevEdges] = useState(null);
  
  const isMobile = useMediaQuery('(max-width:600px)');

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
      if (!Array.isArray(result) || result.length === 0) {
        if (result === "Not a bipartite graph")
          throw new Error(result);
        else
          throw new Error(`Invalid result from ${algorithmName}`);
      }
      setAlgoError("");
      setCost(null);
      if (prevEdges !== null)
        setEdges(prevEdges);
      updateNetwork(result, edges, directed);
    } catch (error) {
      setAlgoError(`${error.message}`);
      setTimeout(() => {
        setAlgoError("");
      }, 2000);
    }
  };

  const handleInput = (e) => {
    const parsedData = e.target.value.trim().split(" ").map(Number);
    setSource(parsedData[0]);
    setDest(parsedData[1]);
  };

  const handleSubmit = () => {
    setShowInput(false);
    try {
      const result = shortestPath(edges, nodes.length, src, dest, directed);
      if (!result.path || result.path.length === 0 || result.path.length === 1) {
        if (prevEdges) {
          setEdges(prevEdges);
          setPrevEdges(null);
        }
        setCost(null);
        throw new Error('Invalid input');
      }
      setAlgoError("");
      setCost(null);
      setPrevEdges([...edges]);

      const pathLength = result.path.length;
      let pathIndex = 0;
      const updatedEdges = edges.map((edge) => {
        if (pathIndex < pathLength - 1 &&
            result.path[pathIndex] === edge.from && result.path[pathIndex + 1] === edge.to) {
          pathIndex++;
          return { ...edge, dashes: true, color: "red" };
        } else {
          return { ...edge, dashes: false, color: "black" };
        }
      });
      setCost(result.cost);
      updateNetwork(nodes, updatedEdges, directed);
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
  const handleBipartite = () => { runAlgorithm(bipartite, "Bipartite Graph") };

  const buttons = [
    <Button key="cc" onClick={handleConnectedComponents}>Connected Components</Button>,
    <Button key="scc" onClick={handleStronglyConnectedComponents}>Kosaraju Algorithm</Button>,
    <Button key="dijkstra" onClick={handleDijkstra}>Single Source Shortest Path</Button>,
    <Button key="bipartite-graph" onClick={handleBipartite}>Bipartite Graph</Button>
  ];

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row", 
      maxWidth: "100%", 
      padding: isMobile ? 2 : 10,
      gap: 2
    }}>
      {!isMobile && <VideoComponent />}
      
      <Box sx={{ 
        width: isMobile ? '100%' : '30%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        order: isMobile ? 2 : 1
      }} className="border rounded border-1 shadow p-3">
        <FormControlLabel
          control={<IOSSwitch checked={directed} onChange={handleDirectedChange} />}
          label={directed ? "Directed Graph" : "Undirected Graph"}
        />
        <TextField
          label="Graph Data"
          multiline
          rows={isMobile ? 6 : 10}
          fullWidth
          variant="outlined"
          value={graphData}
          onChange={(e) => setGraphData(e.target.value)}
        />
        {showInput && (
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Enter source and destination nodes"
              variant="standard"
              onChange={handleInput}
              fullWidth={isMobile}
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              style={{ backgroundColor: "green" }}
            >
              Run
            </Button>
          </Box>
        )}
        {showInput && <Typography variant="caption">Shortest path edges will be dashed and red colored</Typography>}
        <FormControl fullWidth>
          <ButtonGroup
            orientation={isMobile ? "horizontal" : "vertical"}
            aria-label="algorithm button group"
            variant="contained"
            sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}
          >
            {buttons}
          </ButtonGroup>
        </FormControl>
        {!isMobile && <Guidelines />}
      </Box>

      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2, 
        width: isMobile ? "100%" : "70%",
        order: isMobile ? 1 : 2
      }}>
        <Box
          sx={{ 
            height: isMobile ? '300px' : '500px', 
            borderRadius: 2, 
            backgroundColor: "whitesmoke"
          }}
          className="border border-1 shadow"
          ref={containerRef}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {algoError && <Alert severity="error">{algoError}</Alert>}
          {dataError && <Alert severity="error">{dataError}</Alert>}
          {cost && <Alert severity="info">{`Shortest path cost is : ${cost}`}</Alert>}
        </Box>
      </Box>

      {isMobile && (
        <Box sx={{ order: 3, width: '100%' }}>
          <VideoComponent />
          <Guidelines />
        </Box>
      )}
    </Box>
  );
};

export default GraphVisualizer;