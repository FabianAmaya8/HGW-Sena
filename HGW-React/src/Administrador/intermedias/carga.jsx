import { Box } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';

const Carga = ()=>{
    return (
        <Box sx={{zIndex: 3, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display:"flex", justifyContent: "center", alignItems: "center", background:"rgba(0, 0, 0, 0.5)"}} >
            <Box sx={{width: "100%", height: "100%", backgroundColor: "transparent", position: "relative"}}>
                <LinearProgress sx={{ height: 10, position: 'absolute', bottom: 0, left: 0, width: "100%", '& .MuiLinearProgress-bar': {backgroundColor: '#66BB6A'}}}/>
            </Box>
        </Box>
    )
}

export default Carga;