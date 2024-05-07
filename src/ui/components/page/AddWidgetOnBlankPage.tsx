import {
  Avatar,
  Badge,
Box,
Icon,
IconButton,
Paper,
Stack,
Typography,
styled
} from "@mui/material";
import { IJsonModel } from "flexlayout-react";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import GridWidgets from "../../../data/GridWidgets.json";
import SheetWidgets from "../../../data/SpreadSheetWidgets.json";
import ChartWidgets from "../../../data/ChartWidgets.json";
import preConfiguredPanels from "../../../data/WidgetConfigurations.json";
import { setCanvasModel } from "../../../redux/action-handlers/canvas/CanvasActions";
import CanvasFactory from "../../canvas/services/CanvasService";
import { HorizontalDivider } from "../common/dividers/Dividers";
import AddCustomWidgetModal from "../custom-widget/AddCustomWidgetModal";
import { setIsPageUnsaved } from "../../../redux/action-handlers/page/PageActions";
import { AccountBalance, BarChart } from "@mui/icons-material";

type AddWidgetOnBlankPageProps = {
  activePageId:string;
  canvasModel:IJsonModel;
  setCanvasModel:(model:IJsonModel) => void;
  setIsPageUnsaved:(value:boolean) => void;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#020305",
  backgroundImage:"none",
  padding: theme.spacing(1),
  paddingLeft: "1em",
  fontSize: "15px",
  cursor: "pointer",
  display: "flex",
  color: "#D5E2F0",
  alignItems: "center",
}));

const AddWidgetOnBlankPage = (props:AddWidgetOnBlankPageProps) => {
  
  const [openCustomWidgetModal,setOpenCustomWidgetModal] = useState<boolean>(false);
  const [widgetType,setWidgetType] = useState<string>("");

  const panelData = Object.values(preConfiguredPanels);
  const gridData = Object.values(GridWidgets);
  const sheetData = Object.values(SheetWidgets);
  const chartData = Object.values(ChartWidgets);


  const iconButtonStyle = {
    backgroundColor: "#01293F",
    borderRadius: "50%",
    padding: "8px", 
    border: "2px solid #13171F"
  };

  const iconButtonStyle1 = {
    backgroundColor: "#01293F",
    borderRadius: "50%",
    padding: "8px",
    left: "-8px",
    border: "2px solid #13171F"
  };


  const addWidgetPanel = (widgetPanel:any) => {
    const canvasService = CanvasFactory.getInstance();
    const tabSetId = props.canvasModel.layout.children[0].id;
    if(!tabSetId) return;
    const newModel = canvasService.addToModel(
      props.activePageId,
      props.canvasModel,
      tabSetId,
      widgetPanel.name,
      widgetPanel
    );
    props.setCanvasModel(newModel);
    props.setIsPageUnsaved(true);
  }
  const handleOpenCustomWidgetModal = useCallback((widgetType:string) => {
    setWidgetType(widgetType);
    setOpenCustomWidgetModal(true);
  },[openCustomWidgetModal]);

  const handleCloseCustomWidgetModal = useCallback(() => {
    setOpenCustomWidgetModal(false);
  },[openCustomWidgetModal]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 10,
        width: "100%",
        color: "#D5E2F0",
      }}
    >
      <Box sx={{ display: "flex" }}>
        {/* ************************************************************************** */}
        {/* ************************** Panel Widget ********************************** */}
        {/* ************************************************************************** */}

        <Box
          marginRight={3}
          sx={{
            border: "solid #3D3D3D 1px",
            borderRadius: "5px",
            width: 300,
            height:"100%"
          }}
        >
          <Box
            sx={{
              borderTopLeftRadius : "inherit",
              borderTopRightRadius : "inherit",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#131722",
              pl: 0.5,
              pr: 0.5,
            }}
          >
            <Icon sx={{ fontSize: "18px" }}>admin_panel_settings</Icon>
            <Typography sx={[{ paddingX: 1, paddingY: 1, fontSize:"18px", fontWeight : 500 }]}> Panel</Typography>
          </Box>
          <HorizontalDivider />
          <Stack>
            {panelData.map((value: any, key, arr) => (
              <Item key={key} onClick={() => addWidgetPanel(value)}>
                <Box>
                    <IconButton style={iconButtonStyle} aria-label="delete" sx={{width : 24, height : 24}}>
                        <Icon  sx={{ fontSize : 12}} >{value["icon"]}</Icon>
                    </IconButton>
                    <IconButton style={iconButtonStyle1} sx={{width : 24, height : 24}} aria-label="delete" size="medium">
                      <Icon sx={{fontSize : 12}}>{value["icon1"]}</Icon>
                    </IconButton>
                </Box>
                <Box >
                  <Typography className="label-text">
                  {value["name"]}
                  </Typography>
                  </Box>
              </Item>
            ))}
          </Stack>
        </Box>
        {/* ************************************************************************** */}
        {/* ************************** DataGrid Widget ******************************* */}
        {/* ************************************************************************** */}
        <Box
          marginRight={3}
          sx={{
            border: "solid #3D3D3D 1px",
            borderRadius: "5px",
            width: 300,
            height:"100%"
          }}
        >
          <Box
            sx={{
              borderTopLeftRadius : "inherit",
              borderTopRightRadius : "inherit",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#131722",
              pl: 0.5,
              pr: 0.5,
            }}
          >
            <Icon sx={{ fontSize: "18px" }}>grid_on</Icon>
            <Typography sx={[{ paddingX: 1, paddingY: 1, fontSize:"18px", fontWeight : 500 }]}>
              Data Grid
            </Typography>
          </Box>
          <HorizontalDivider />
          <Stack>
            {gridData.map((value: any, key, arr) => (
              <Item sx={{alignContent : "center"}} key={key} onClick={() => addWidgetPanel(value)}>
                <Box >
                  <IconButton style={iconButtonStyle} aria-label="delete" sx={{width : 24, height : 24}}>
                      <Icon  sx={{ fontSize : 12}} >{value["icon"]}</Icon>
                  </IconButton>
                  <IconButton style={iconButtonStyle1} sx={{width : 24, height : 24}} aria-label="delete" size="medium">
                    <Icon sx={{fontSize : 12}}>{value["icon1"]}</Icon>
                  </IconButton>
                
                </Box>
                <Box>
                <Typography className="label-text">
                  {value["name"]}
                  </Typography>
                  </Box>
              </Item>
            ))}
            <Box paddingX={2}>
              <HorizontalDivider />
            </Box>
            <Item onClick={() => handleOpenCustomWidgetModal("grid")}>
              <Icon sx={{ paddingTop: "2px", fontSize:14 }}>widgets</Icon>
              &nbsp;
              <Box><Typography className="label-text">
                  Customize
                  </Typography></Box>
            </Item>
          </Stack>
        </Box>
        {/* ************************************************************************** */}
        {/* ************************** Chart Widget ******************************* */}
        {/* ************************************************************************** */}
        <Box
          marginRight={3}
          sx={{
            border: "solid #3D3D3D 1px",
            borderRadius: "5px",
            width: 300,
            height:"100%"
          }}
        >
          <Box
            sx={{
              borderTopLeftRadius : "inherit",
              borderTopRightRadius : "inherit",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#131722",
              pl: 0.5,
              pr: 0.5,
            }}
          >
            <Icon sx={{ fontSize: "18px" }}>bar_chart</Icon>
            <Typography sx={[{ paddingX: 1, paddingY: 1, fontSize:"18px", fontWeight : 500  }]}>
              Charts
            </Typography>
          </Box>
          <HorizontalDivider />
          <Stack>
            {chartData.map((value: any, key, arr) => (
              <Item key={key} onClick={() => addWidgetPanel(value)}>
                <Box >
                  <IconButton style={iconButtonStyle} sx={{width : 24, height : 24}}>
                      <Icon  sx={{ fontSize : 12}} >{value["icon"]}</Icon>
                  </IconButton>
                  <IconButton style={iconButtonStyle1} sx={{width : 24, height : 24}} >
                    <Icon sx={{fontSize : 12}}>{value["icon1"]}</Icon>
                  </IconButton>
                
                </Box>
                <Box>
                <Typography className="label-text">
                  {value["name"]}
                  </Typography>
                </Box>
              </Item>
            ))}
            <Box paddingX={2}>
              <HorizontalDivider />
            </Box>
            <Item onClick={() => handleOpenCustomWidgetModal("chart")}>
              <Icon sx={{ paddingTop: "2px",fontSize:14 }}>widgets</Icon>
              &nbsp;
              <Box><Typography className="label-text">
                  Customize
                  </Typography></Box>
            </Item>
          </Stack>
        </Box>
        {/* ************************************************************************** */}
        {/* ************************** SpreadSheet Widget ******************************* */}
        {/* ************************************************************************** */}
        <Box
          marginRight={3}
          sx={{
            border: "solid #3D3D3D 1px",
            borderRadius: "5px",
            width: 300,
            height:"100%"
          }}
        >
          <Box
            sx={{
              borderTopLeftRadius : "inherit",
              borderTopRightRadius : "inherit",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#131722",
              pl: 0.5,
              pr: 0.5,
            }}
          >
            <Icon sx={{ fontSize: "18px" }}>view_list</Icon>
            <Typography sx={[{ paddingX: 1, paddingY: 1, fontSize:"18px", fontWeight : 500  }]}>
              Spread Sheet
            </Typography>
          </Box>
          <HorizontalDivider />
          <Stack>
            {sheetData.map((value: any, key, arr) => (
              <Item key={key} onClick={() => addWidgetPanel(value)}>
                <Box>
                  <IconButton style={iconButtonStyle} sx={{width : 24, height : 24}}>
                      <Icon  sx={{ fontSize : 12}} >{value["icon"]}</Icon>
                  </IconButton>
                  <IconButton style={iconButtonStyle1} sx={{width : 24, height : 24}} >
                    <Icon sx={{fontSize : 12}}>{value["icon1"]}</Icon>
                  </IconButton>
                </Box>
                <Box>
                <Typography className="label-text">
                  {value["name"]}
                  </Typography>
                </Box>
              </Item>
            ))}
            <Box paddingX={2}>
              <HorizontalDivider />
            </Box>
            <Item onClick={() => handleOpenCustomWidgetModal("spreadsheet")}>
              <Icon sx={{ paddingTop: "2px",fontSize:14 }}>widgets</Icon>
              &nbsp;
              <Box>
              <Typography className="label-text">
                  Customize
                  </Typography>
              </Box>
            </Item>
          </Stack>
        </Box>
      </Box>
      {<AddCustomWidgetModal open={openCustomWidgetModal} onClose={handleCloseCustomWidgetModal} widgetType={widgetType}/>}
    </Box>
  );
};
function mapStateToProps(state:any) {
  return {
    activePageId:state.page.activePageId,
    canvasModel:state.canvas.canvasModel,
  }
}
function mapDispatchToProps(dispatch:Dispatch) {
  return {
    setCanvasModel:(model:IJsonModel) => dispatch(setCanvasModel(model)),
    setIsPageUnsaved:(value:boolean) => dispatch(setIsPageUnsaved(value))
  }
}
export default React.memo(connect(mapStateToProps,mapDispatchToProps)(AddWidgetOnBlankPage));
