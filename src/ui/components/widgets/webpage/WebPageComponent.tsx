import React, { ReactElement } from "react";

import { Box } from "@mui/material";
import { WidgetProps } from "../../../canvas/services/WidgetService";


export interface WebPageComponentProps extends WidgetProps {
}


const WebPageComponent = React.forwardRef(
  (props: WebPageComponentProps, ref): ReactElement => {

    return (
      <Box sx={{ height: "100%" }}>
        <iframe src="https://auttrading.com" sandbox="" style={{height:"100%",width:"100%"}}/>
      </Box>
    );
  }
);

export default React.memo(WebPageComponent);
