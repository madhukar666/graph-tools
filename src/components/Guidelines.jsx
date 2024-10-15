import React from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Typography,
    Card, List, ListItem, ListItemIcon, ListItemText, CardContent
} from '@mui/material';
import { ExpandMore, ToggleOn, Input, Code, Info } from '@mui/icons-material';

export const Guidelines = () => {
    return (
        <div className="p-4 overflow-y-scroll h-30">
            <Accordion className="bg-emerald-600">
                <AccordionSummary
                    expandIcon={<ExpandMore className="text-black" />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography className="text-black font-bold">GUIDELINES</Typography>
                </AccordionSummary>
                <AccordionDetails
                    className="bg-white"
                    sx={{
                        maxHeight: 500, // Set a max height for the container
                        overflowY: 'auto'  // Enable vertical scrolling
                    }}
                >
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
                                    <Card variant="outlined" className="mt-2">
                                        <CardContent>
                                            <Typography variant="body2" component="p">
                                                Mention the number of nodes in the first line and edges in the next lines.
                                            </Typography>
                                            <Typography variant="subtitle1" className="font-bold mt-2">
                                                Unweighted graph format: <strong>from to</strong>
                                            </Typography>
                                            <Typography variant="body2" className="p-2">
                                                Example:
                                                <br />1 2
                                                <br />2 3
                                                <br />4 3
                                            </Typography>
                                            <Typography variant="subtitle1" className="font-bold mt-2">
                                                Weighted graph format: <strong>from to weight</strong>
                                            </Typography>
                                            <Typography variant="body2" className="p-2">
                                                Example:
                                                <br />1 2 4
                                                <br />2 3 3
                                                <br />4 3 1
                                            </Typography>
                                        </CardContent>
                                    </Card>
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
        </div >
    );
};

export default Guidelines;
