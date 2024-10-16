import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Icon } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { VideoComponent } from './VideoComponent';
function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{ marginBottom: "5px" }}>
            <Container>
                <Toolbar disableGutters>
                    <Icon sx={{ height: "50px", width: "50px", marginRight: "10px" }}> <VideoComponent /></Icon>

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            ///display: { xs: 'none', md: 'flex' },
                            fontFamily: "revert",
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        VisualGraph
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
