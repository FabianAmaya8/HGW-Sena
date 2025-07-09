import React from 'react';
import { Box, Typography, keyframes, useTheme } from '@mui/material';

const spinClockwise = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinCounter = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`;

const Loader = () => {
    const theme = useTheme();
    const size = 80;

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box sx={{ position: 'relative', width: size, height: size, mb: 2 }}>
                <Box
                    component="span"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: `4px solid ${theme.palette.primary.main}`,
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: `${spinClockwise} 1.2s linear infinite`,
                    }}
                />
                <Box
                    component="span"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        width: `calc(100% - 16px)`,
                        height: `calc(100% - 16px)`,
                        border: `4px solid ${theme.palette.secondary.main}`,
                        borderBottomColor: 'transparent',
                        borderRadius: '50%',
                        animation: `${spinCounter} 0.9s linear infinite`,
                    }}
                />
            </Box>
            <Typography variant="h6" color="text.secondary">
                Cargando aplicación...
            </Typography>
        </Box>
    );
};

export default Loader;
