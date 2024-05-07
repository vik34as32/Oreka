import { Box, LinearProgress, Typography } from "@mui/material"


type ProgressProps = {
    value : number
}


const Progress = (props:ProgressProps) => {
    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1, color : "#FF0000" }}>
                        <LinearProgress sx={{height : 10}} color="primary" variant="determinate" {...props} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                            props.value,
                        )}%`}</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}


export default Progress