import { CircularProgress, CircularProgressProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';

export type CircularProgressBarProps = CircularProgressProps & {value:number,onComplete?:() => void};

function CircularProgressBar(props: CircularProgressBarProps) {
  useEffect(() => {
    if(Math.round(props.value) === 100 && props.onComplete) {
        props.onComplete();
    }
  },[props.value]);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant={"determinate"} size={props.size} value={props.value} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontSize={typeof props.size === "number" ? (props.size)/12 : undefined}
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default React.memo(CircularProgressBar);