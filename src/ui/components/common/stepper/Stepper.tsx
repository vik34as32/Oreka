import { Box } from "@mui/material";
import StepCompleted from "@svg/StepCompleted.svg";
import StepNotSelected from "@svg/StepNotSelected.svg";
import StepSelected from "@svg/StepSelected.svg";
import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useState } from "react";

export interface StepperProps {
  activeStep: number;
  stepData: StepData[];
}
export type StepData = {
  label: string;
};
export type StepperHandles = {
  next:() => void;
  prev:() => void;
}
// type StepState = { [k: number]: boolean };
const Stepper = React.forwardRef<StepperHandles,StepperProps>((props: StepperProps,ref): ReactElement => {
  const [activeStep, setActiveStep] = useState<number>(props.activeStep);
  
  // useEffect(() => {
  //   if (props.stepData.length) {
  //     const newStepState = { ...stepState };
  //     props.stepData.forEach((data, index) => {
  //       if (index < activeStep) newStepState[index] = true;
  //       else newStepState[index] = false;
  //     });
  //     setStepState(newStepState);
  //   }
  // }, [props.stepData]);
  useEffect(() => {
    setActiveStep(props.activeStep);
  },[props.activeStep])
  const getIconForStep = (step: number) => {
    if (step === activeStep) {
      return <StepSelected />;
    } else if (step < activeStep) {
      return <StepCompleted />;
    }
    return <StepNotSelected />;
  };
  const next = useCallback(() => {
    setActiveStep(activeStep => {
      if(activeStep === props.stepData.length - 1) return activeStep;
      return activeStep+1;
    });
  },[]);
  const prev = useCallback(() => {
    setActiveStep(activeStep => {
      if(activeStep === 0) return activeStep;
      return activeStep-1;
    });
  },[activeStep]);
  useImperativeHandle(ref,()=>({
    next,
    prev
  }))
  return (
    <Box sx={{width:"100%", p:1,pl:2,pr:2,display:"flex",justifyContent:"space-evenly"}}>
      {
        props.stepData.map((data,index) => (
          <Box display={"flex"} flexDirection={"column"}>
            <Box sx={{ display: "flex", fontSize: 12 }}>{data.label}</Box>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
              {getIconForStep(index)}
              {index+1 !== props.stepData.length && <Box sx={{ height: 2, width: 320/(props.stepData.length-1), background: activeStep > index ? "#0080C5" : "#6A7187" }}></Box>}
            </Box>
          </Box>
        ))
      }
    </Box>
  );
});

export default React.memo(Stepper);
