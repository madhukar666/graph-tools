import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card, List, ListItem, ListItemIcon, ListItemText, CardHeader } from '@mui/material';
import { ExpandMore, ToggleOn, Input, Code, Info } from '@mui/icons-material';

export const Guidelines = () => {
    return (
        <div className="p-4">
            <Accordion className="bg-emerald-600">
                <AccordionSummary
                    expandIcon={<ExpandMore className="text-white" />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography className="text-white font-bold">GUIDELINES</Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-white">
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <ToggleOn className="text-emerald-600" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Toggle Graph Type"
                                secondary="Switch between directed and undirected graph representations"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Input className="text-emerald-600" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Input Format"
                                secondary={
                                    <React.Fragment>
                                        <Card className="flex justify-content-center align-items-center">
                                            <p>Mention the number of nodes in the first line and edges in the next lines</p>
                                            {/* <CardHeader style={{ color: "black" }}>Examples:</CardHeader> */}
                                            <p>Unweighted graph format : <strong>from to</strong></p>
                                            <pre className="p-2 text-center">
                                                {"Example:\n"}
                                                {"1 2\n2 3\n4 3\n"}
                                            </pre>
                                            <p>Weighted graph format : <strong>from to weight</strong></p>
                                            <pre className="p-2 text-center">
                                                {"Example:\n"}
                                                {"1 2 4\n2 3 3\n4 3 1\n"}
                                            </pre>
                                        </Card>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Code className="text-emerald-600" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Visualization"
                                secondary="The graph will be automatically rendered based on your input"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Info className="text-emerald-600" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Algorithms"
                                secondary="Use the Algorithms tab to run various graph algorithms and visualize the results"
                            />
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Guidelines;