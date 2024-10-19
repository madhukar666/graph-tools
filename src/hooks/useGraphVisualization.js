import { useCallback } from 'react';
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data";
import { groupStyles } from '../constants/graphStyles';
export const useGraphVisualization = (containerRef, networkRef) => {
    const createNetwork = useCallback((nodes, edges, directed) => {
        const edge = directed === true ? true : false;

        // console.log(edge)
        const data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges),
        };
        const options = {
            groups: groupStyles,
            autoResize: true,
            height: "500px",
            width: "100%",
            physics: { enabled: true },
            nodes: {
                shape: "circle",
                size: 50,
                color: { background: "white", border: "black" },
                font: { size: 30, color: "black" },
                borderWidth: 2,
            },
            interaction: {
                dragView: false,
                dragNodes: true,
                zoomView: false
            },
            edges: {
                arrows: { to: { enabled: edge, scaleFactor: 1 } }
                ,
                color: { color: "#4a5568" },
                width: 2,
                smooth: { enabled: false, type: 'curvedCW', roundness: 0.2 },
                length: 200
            }
        }
        if (networkRef.current != null) {
            networkRef.current = null;
            // networkRef.current.destroy();
            // console.log(data);
            networkRef.current = new Network(containerRef.current, data, options);
            networkRef.current.setSize("100%", "500px");
        }
        else {
            networkRef.current = new Network(containerRef.current, data, options);
            networkRef.current.setSize("100%", "500px");
        }

    }, [containerRef, networkRef]);

    const updateNetwork = useCallback((updatedNodes, updatedEdges, directed) => {
        const data = {
            nodes: new DataSet(updatedNodes),
            edges: new DataSet(updatedEdges),
        };
        if (networkRef.current) {
            networkRef.current.setData(data);
            networkRef.current.setOptions({
                edges: { arrows: { to: { enabled: directed } } }
            });
        }

    }, [networkRef]);
    return { createNetwork, updateNetwork };
};