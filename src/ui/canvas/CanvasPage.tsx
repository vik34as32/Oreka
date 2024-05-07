import { CssBaseline, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { IJsonModel } from "flexlayout-react";
import { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { PopoutContext } from "../../App";
import * as appActions from '../../redux/action-handlers/app/AppActions';
import * as canvasActions from '../../redux/action-handlers/canvas/CanvasActions';
import { addNewPage } from "../../redux/action-handlers/page/PageActions";
// import { POPOUT_SERVICE_EVENT_SOURCE, POPOUT_WINDOW_CLOSE, POPOUT_WINDOW_EVENT_SOURCE, POPOUT_WINDOW_READY } from "../../utilities/Constants";
import Header from "../components/Header";
import Loader from "../components/common/loader/Loader";
import { WidgetConfigsType } from "../components/custom-widget/WidgetConfig";
const CanvasContainer  = lazy(() => import("./CanvasContainer"));
import CanvasFactory, { PageMetaInfoType } from "./services/CanvasService";
import ErrorBoundary from "../components/common/ErrorBoundry";
interface PopoutEventData {
    souce:string;
    payload:string;
}
interface PopoutWidgetData {
    panelName:string,
    widgetId:string;
    widgetProps:WidgetConfigsType
}
type CanvasProps = {
    customDate: number | undefined,
    sendMessage: (message: any) => void,
    fetchData: (canvas: any, login: string, time: number | undefined) => { type: string; requestType: any; tabs: [string]; loginUser: string, time: number }[],
    fetchCanvas: (id: any) => void,
    prepActiveColumns: (canvas: any, loginId: string) => { type: string; columns: any; loginUser: string; requesttype: any }[],
    loginUser: any,
    activeColumns: [],
    canvasComponents: any,
    fetchAddWidgetMetaData: () => void,
    updateServerWithActiveColumnChange: (model: any, loginId: string) => void,
    pages:PageMetaInfoType[];
    addNewPage:(pageId:string,name:string,shortName:string) => void;
    setCanvasModel:(model:IJsonModel) => void;
    activePageId : string
}

type CanvasState = {
    addCustomWidgetModal:boolean;
}

class CanvasPage extends Component<CanvasProps, CanvasState> {
    constructor(props: CanvasProps) {
        super(props);
        this.state = {
            addCustomWidgetModal:false
        }
        CanvasPage.contextType = PopoutContext;
    }
    
    componentDidMount(): void {
        this.props.fetchAddWidgetMetaData();
        if (this.props.loginUser != undefined) {
            this.props.fetchCanvas(this.props.loginUser.data.id)
        }
        const isPopout = this.context;
        if(isPopout) {
            this.initializePopoutWindow();
        }
    }
    componentWillUnmount(): void {
        window.removeEventListener("message",this.handleDataFromParentWindow);
    }

    updateServerWithActiveColumnChange(model: any) {
        this.props.updateServerWithActiveColumnChange(model, this.props.loginUser.data.id)
        this.props.prepActiveColumns(model, this.props.loginUser.data.id).forEach((items) => {
            this.props.sendMessage(items)
        })
    }
    initializePopoutWindow() {
        const parentWindow: Window = window.opener;
        parentWindow.postMessage(
          {
            source: POPOUT_WINDOW_EVENT_SOURCE,
            windowId: window.name,
            type: POPOUT_WINDOW_READY,
          },
          window.location.origin
        );
        // add event listener to receive message from parent window
        window.addEventListener(
          "message",
          this.handleDataFromParentWindow.bind(this)
        );
        window.onbeforeunload = () => {
          parentWindow.postMessage(
            {
              source: POPOUT_WINDOW_EVENT_SOURCE,
              windowId: window.name,
              type: POPOUT_WINDOW_CLOSE,
            },
            window.location.origin
          );
        };
    }
    handleDataFromParentWindow(event:MessageEvent) {
        // used only in case of popout windows 
        if(event.origin === window.location.origin && event.data.source === POPOUT_SERVICE_EVENT_SOURCE) {
            const data:PopoutEventData = event.data;
            const payload:PopoutWidgetData = JSON.parse(data.payload);
            const canvasService = CanvasFactory.getInstance();
            this.props.addNewPage("temp","temp","TM");
            canvasService.addAllWidgetsToPage("temp",{
                [payload.widgetId]:payload.widgetProps
            })
            const model = canvasService.addPopoutComponentToCanvasModel(payload.widgetId,payload.panelName);
            this.props.setCanvasModel(model);
        }
    }

    render() {
        return (
            <>
                <Box sx={{ height: "100vh", alignItems: 'center', display: 'flex', width: "100%" }}>
                    <CssBaseline />
                    <Stack direction={"column"} sx={{ width: "100%", height: '100%' }}>
                        <PopoutContext.Consumer>
                        {isPopout => 
                            (!isPopout ? <Header/> : null)
                        }
                        </PopoutContext.Consumer>
                        <PopoutContext.Consumer>
                        {isPopout =>(
                            this.props.pages.length === 0 && !isPopout ? (
                                <Loader size={60}/>
                            ):(
                            <Box className="canvas_main_content">
                                <Suspense fallback={<Loader size={30} disableShrink/>}>
                                    <ErrorBoundary activePageId={this.props.activePageId}>
                                    <CanvasContainer/>
                                    </ErrorBoundary>
                                     
                                </Suspense>
                            </Box>
                            )
                        )
                        }
                        </PopoutContext.Consumer>
                        
                    </Stack>
                </Box>
            </>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        headerTabs: state.app.headerTabs,
        selectedTab: state.app.selectedTab,
        datasources: state.app.datasources,
        websocketStatus: state.app.websocketStatus,
        loginUser: state.app?.loginUser,
        activeColumns: state.canvas?.activeColumns,
        canvasComponents: state.canvas?.canvasComponents,
        addWidgetMetaData: state.app.addWidgetMetaData,
        customDate: state.app.customDate,
        addCustomWidgetPopUpDialog: state.app?.addCustomWidgetPopUpDialog,
        pages:state.page.pages,
        activePageId : state.page.activePageId
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        fetchAddWidgetMetaData: () => appActions.fetchAddWidgetMetaData(dispatch),
        connectWebSocket: () => appActions.connectWebSocket(dispatch),
        fetchHeadersTiles: (id: string) => appActions.fetchHeadersTiles(id),
        fetchMetaData: (id: string) => appActions.fetchMetaData(id),
        fetchData: (canvas: any, login: string, time: number | undefined) => canvasActions.fetchData(canvas, login, time),
        sendMessage: (message: any) => appActions.sendMessage(message),
        fetchCanvas: (id: any) => canvasActions.fetchCanvas(dispatch, id),
        prepActiveColumns: (canvas: any, loginId: string) => canvasActions.prepActiveColumns(canvas, loginId),
        updateServerWithActiveColumnChange: (model: any, loginId: string) => canvasActions.updateServerWithActiveColumnChange(model, loginId, dispatch),
        addNewPage:(pageId:string,name:string,shortName:string) => dispatch(addNewPage(pageId,name,shortName)),
        setCanvasModel:(model:IJsonModel) => dispatch(canvasActions.setCanvasModel(model))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasPage);
