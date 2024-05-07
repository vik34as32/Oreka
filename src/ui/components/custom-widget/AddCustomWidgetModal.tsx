import CloseIcon from "@mui/icons-material/Close";
import {
Button,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
Grid,
IconButton,
Typography
} from "@mui/material";
import { IJsonModel } from "flexlayout-react";
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setCanvasModel } from "../../../redux/action-handlers/canvas/CanvasActions";
import { setIsPageUnsaved } from "../../../redux/action-handlers/page/PageActions";
import { dataSources } from "../../../redux/reducers/canvas/CanvasReducer";
import CanvasFactory from "../../canvas/services/CanvasService";
import WidgetFactory, { WIDGET_COMPONENTS, WidgetPropsType } from "../../canvas/services/WidgetService";
import Loader from "../common/loader/Loader";
import GridComponent from "../widgets/GridComponent";
import ChartWrapper from "../widgets/chart/ChartWrapper";
import { DealingPanelChartComponentProps } from "../widgets/chart/DealingPanelChartComponent";
import DealingPanelChartWrapper from "../widgets/chart/DealingPanelChartWrapper";
import { DealingPanelSpreadSheetComponentProps } from "../widgets/spreadsheet/DealingPanelSpreadSheetComponent";
import DealingPanelSpreadSheetWrapper from "../widgets/spreadsheet/DealingPanelSpreadSheetWrapper";
import SpreadSheetWrapper from "../widgets/spreadsheet/SpreadSheetWrapper";
import { WatchListPropsType } from "../widgets/watch-list/WatchListComponent";
import WidgetConfig, { WidgetConfigsType } from "./WidgetConfig";

type AddCustomWidgetModalProps = {
  open: boolean;
  onClose: () => void;
  widgetType:string;
  activeTabSet:string;
  activePageId: string;
  setCanvasModel:(model:IJsonModel) => void;
  canvasModel:IJsonModel;
  componentId? : string;
  isEdit? : boolean ;
  setIsPageUnsaved:(value:boolean) => void;
  
};
const initalState = {
  id:"untitiled",
  componentType: "grid",
  dataSourceId: dataSources[0].id,
  filterBy: [],
  functionCols: [],
  groupBy: [],
  name: "test",
  splitBy: [],
  visibleCols: [],
  pivot:false,
  chartType: "",
  filterColor:{color:"gray",type:"unlink"},
  orderBy : []
}
const AddCustomWidgetModal: FC<AddCustomWidgetModalProps> = ({
  open,
  onClose,
  ...props
}): ReactElement => {

  console.log(props,"data hnand")
  const widgetServiceInstance = WidgetFactory.getInstance();
  console.log(widgetServiceInstance,"widgetServiceInstance")
  const widgetConfigRef = useRef(null);
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfigsType | undefined>(undefined);
  console.log(widgetConfigs,"widgetConfigs")
  const [widgetPropsType , setWidgetPropsType] = useState<WidgetPropsType | undefined>(undefined);
  console.log(widgetPropsType,"widgetPropsType")
  const dealingPanelSpreadSheetRef = useRef();
  const dealingPanelChartRef = useRef();
  const [selectedComponentType,setSelectedComponentType] = useState<string>("");
  useEffect(() => {
    if(props.isEdit && props.componentId && open){
      const widgetProps : WidgetPropsType | undefined = widgetServiceInstance.getProps(props.componentId);
      //debugger
      if(widgetProps){
        setWidgetPropsType(widgetProps);
        setWidgetConfigs(widgetProps);
      }
    }
    else setWidgetConfigs(initalState);
  },[]);

  const handleClose = () => {
    setWidgetConfigs(initalState);
    onClose();
  }

  useEffect(() => {
    setSelectedComponentType(props.widgetType);
  }, [props.widgetType]);

  const getWidgetComponent = () : WIDGET_COMPONENTS => {
    switch(selectedComponentType) {
      case "chart":
        return WIDGET_COMPONENTS.CHART;
      case "spreadsheet":
        return WIDGET_COMPONENTS.SHEET;
      case "grid":
        return WIDGET_COMPONENTS.GRID;
      default:
        return WIDGET_COMPONENTS.GRID;
    }
  }

  const updateWidget = () => {
    if(props.componentId && widgetConfigs && widgetConfigs.componentType){
      const widgetProp = widgetServiceInstance.getProps(props.componentId);
      if(!widgetProp) return;
      widgetServiceInstance.setComponent(widgetProp.id, getWidgetComponent());
      widgetConfigs.id = widgetProp.id;
      widgetProp.componentType = selectedComponentType;
      // construct object of type WidgetPropsType from widgetConfigs and widgetProp for update
      const temp : WidgetPropsType ={
        ...widgetConfigs,
        filterColor : widgetProp.filterColor,
        ref : widgetProp.ref,
        subscribedTickers : widgetProp.subscribedTickers,
      }
      widgetServiceInstance.setProps(props.componentId, temp);
      props.setCanvasModel({...props.canvasModel});
      props.setIsPageUnsaved(true);
      handleClose();
    }

  }

  const discard  = () => {
    if(props.componentId){
      const widgetProps : WidgetPropsType | undefined = widgetServiceInstance.getProps(props.componentId);
      if(widgetProps){
        setWidgetPropsType(widgetProps);
        setWidgetConfigs(widgetProps);
      }
    } else {
      setWidgetConfigs(initalState);
      setWidgetPropsType(undefined);

    }
    if(widgetConfigRef.current){
      widgetConfigRef.current.onDiscard();
    }
  }

  const addWidget = () => {
    if(!widgetConfigs) return;
    
    const canvasService = CanvasFactory.getInstance();
    const panelName = widgetConfigs.groupBy.length ? widgetConfigs.groupBy[0] : 'No Group';
    const activeTabSet = props.activeTabSet ?? props.canvasModel.layout.children[0].id ?? "";
    if(widgetConfigs.componentType === "spreadsheet" && widgetConfigs.dataSourceId === "dealing-panel-interval") {
      widgetConfigs.componentType = "dealing-panel-spreadsheet";
    }
    else if(widgetConfigs.componentType === "chart" && widgetConfigs.dataSourceId === "dealing-panel-interval")
      widgetConfigs.componentType = "dealing-panel-chart";
    const newModel = canvasService.addToModel(props.activePageId,props.canvasModel,activeTabSet,panelName,(widgetConfigs as WatchListPropsType));
    if(widgetConfigs.componentType === "dealing-panel-spreadsheet") 
      dealingPanelSpreadSheetRef.current?.saveTimeData(widgetConfigs as DealingPanelSpreadSheetComponentProps);
    else if(widgetConfigs.componentType === "dealing-panel-chart") 
      dealingPanelChartRef.current?.saveTimeData(widgetConfigs as DealingPanelChartComponentProps);
    
    props.setCanvasModel(newModel);
    props.setIsPageUnsaved(true);
    handleClose();
  }
  const getPreviewComponent = ():ReactElement => {
    if(!widgetConfigs) return <></>;
    if(selectedComponentType === "dealing-panel-chart" || (selectedComponentType === "chart" && widgetConfigs.dataSourceId === "dealing-panel-interval")) {
      return <DealingPanelChartWrapper {...widgetConfigs} ref={dealingPanelChartRef}/>;
    } else if (selectedComponentType === "dealing-panel-spreadsheet" || (selectedComponentType === "spreadsheet" && widgetConfigs.dataSourceId === "dealing-panel-interval")) {
      
      return <DealingPanelSpreadSheetWrapper {...widgetConfigs} ref={dealingPanelSpreadSheetRef}/>
    } else {
      switch(selectedComponentType) {
        case "grid":
          return <GridComponent {...widgetConfigs} />
        case "spreadsheet":
          return <SpreadSheetWrapper {...widgetConfigs} />
        case "chart":
          return <ChartWrapper {...widgetConfigs}/>
        default:
          return <></>;
      }
    }
  }

  const changeSelectedComponentType = (componentType: string) => {
    setSelectedComponentType(componentType);
  }

  return (
    <React.Suspense fallback={<Loader size={20}/>}>
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"xl"}>
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography variant="h6" fontWeight={700}>
          { props.componentId ? "Edit Widget" : "Customize Widget"}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
       <DialogContent sx={{ p: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <WidgetConfig ref={widgetConfigRef} componentType={selectedComponentType} widgetPropsType = {widgetPropsType} changeSelectedComponentType={changeSelectedComponentType} />
          </Grid>
          <Grid item xs={7} maxHeight={625}>
            {open && 
              getPreviewComponent()
            }
          </Grid>
        </Grid>
      </DialogContent> 
      <DialogActions>
        <Button variant="outlined" sx={{ color: "white" }} onClick={() => {discard()}}>
          Discard
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "white" }}
          onClick={() => {
            if(widgetConfigRef.current){
              setWidgetConfigs(widgetConfigRef.current.getWidgetConfigs())
            }
          }
          }
        >
          Apply Changes
        </Button>
        <Button variant="contained" onClick={ props.componentId ? updateWidget : addWidget}>{ props.componentId ? "Update Widget" : "Add Widget"}</Button>
      </DialogActions>
    </Dialog>
    </React.Suspense>
  );
};
function mapStateToProps(state:any) {
  return {
    activeTabSet:state.canvas.activeTabSet,
    activePageId: state.page.activePageId,
    canvasModel:state.canvas.canvasModel,
  }
}
function mapDispatchToProps(dispatch:Dispatch) {
  return {
    setCanvasModel:(model:IJsonModel) => dispatch(setCanvasModel(model)),
    setIsPageUnsaved:(value:boolean) => dispatch(setIsPageUnsaved(value))
  }
}
export default React.memo(connect(mapStateToProps,mapDispatchToProps)(AddCustomWidgetModal));
