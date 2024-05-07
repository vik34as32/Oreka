import { Box, IconButton, SvgIconTypeMap } from "@mui/material";
import { ReactElement } from "react";
import { DeleteOutline, BarChartOutlined, AccountBalanceOutlined } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type DoubleIconProps = {
    firstIcon : OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    secondIcon : OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const DoubleIcon = (props : DoubleIconProps) => {

    const iconButtonStyle = {
        backgroundColor: "#01293F",
        borderRadius: "50%",
        padding: "8px",
        border: "2px solid #131722"
      };
    
      const iconButtonStyle1 = {
        backgroundColor: "#01293F",
        borderRadius: "50%",
        padding: "8px",
        left: "-10px",
        border: "2px solid #131722"
      };

      return (
        <Box>
            <IconButton style={iconButtonStyle} aria-label="delete" sx={{width : 32, height : 32}}>
                <props.firstIcon fontSize="small" style={{ color: "white" }} />
            </IconButton>
            <IconButton style={iconButtonStyle1} sx={{width : 32, height : 32}} aria-label="delete" size="medium">
                <props.secondIcon fontSize="small" style={{ color: "white" }} />
            </IconButton>
        </Box>
      )

}

export default DoubleIcon