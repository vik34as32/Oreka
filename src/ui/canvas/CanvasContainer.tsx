// import { AddTwoTone, CloseFullscreen, OpenInFull, OpenInNew } from '@mui/icons-material';
// import CloseIcon from '@mui/icons-material/Close';
// import { IconButton, Tooltip } from '@mui/material';
// import * as FlexLayout from "flexlayout-react";
// import { cloneDeep } from 'lodash';
// import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// import { connect } from 'react-redux';
// import { Dispatch } from 'redux';
// import { PopoutContext } from '../../App';
// import { fetchSelectedTheme, fetchTemplates, fetchThemes, openAddWidgetModal, setActiveTabSet, toggleTdhModal, toogleAddPageModal } from '../../redux/action-handlers/app/AppActions';
// import { setCanvasModel, setFilterColor, setFilters } from '../../redux/action-handlers/canvas/CanvasActions';
// import { setIsPageUnsaved } from '../../redux/action-handlers/page/PageActions';
// import FilterBar from '../components/common/filter/FilterBar';
// import useKeyBoardShortCut from '../components/common/keyboard-shortcut/useKeyBoardShortcut';
// import Loader from '../components/common/loader/Loader';
// import WidgetLink, { LinkColor, linkColors } from '../components/common/widget-link/WidgetLink';
// import WidgetMenu from '../components/common/widget-menu/WidgetMenu';
// import AddCustomWidgetModal from '../components/custom-widget/AddCustomWidgetModal';
// import { Filter } from '../components/custom-widget/WidgetConfig';
// import AddWidgetOnBlankPage from '../components/page/AddWidgetOnBlankPage';
// import DealingPanelComponent from '../components/widgets/DealingPanelComponent';
// import LoginDevicePanelComponent from '../components/widgets/LoginDevicePanelComponent';
// import GridComponent from '../components/widgets/GridComponent';
// import { Theme } from '../components/widgets/ThemeModal/ThemeTemplateModal';
// import ChartWrapper from '../components/widgets/chart/ChartWrapper';
// import DealingPanelChartWrapper from '../components/widgets/chart/DealingPanelChartWrapper';
// import ReportComponent from '../components/widgets/report/Report';
// import DealingPanelSpreadSheetWrapper from '../components/widgets/spreadsheet/DealingPanelSpreadSheetWrapper';
// import SpreadSheetWrapper from '../components/widgets/spreadsheet/SpreadSheetWrapper';
// import WatchListComponent from '../components/widgets/watch-list/WatchListComponent';
// import WebPageComponent from '../components/widgets/webpage/WebPageComponent';
// import CanvasFactory, { PageMetaInfoType } from './services/CanvasService';
// import PopoutFactory from './services/PopoutService';
// import WidgetFactory, { WIDGET_COMPONENTS, WidgetHandles, WidgetPropsType } from './services/WidgetService';
// import ProfitLossReport from '../components/widgets/ProfitLossReport/ProfitLossReport';
// import AlertNotificationComponent from '../components/widgets/AlertNotificationComponent';
// import EventManagementComponent from '../components/widgets/EventManagement/EventManagementComponent';
// import EventEmitterService from '../../utilities/EventEmitter';
// import { PAGE_SAVE } from '../../utilities/Constants';



// export interface CanvasState {
//     activeTabSet:string | undefined;
//     filters:GlobalFilters,
//     filterColor:LinkColor,
//     canvasModel: FlexLayout.IJsonModel | null
// }
// export type CanvasContainerProps = {
//     canvasModel:FlexLayout.IJsonModel,
//     toggleAddWidgetModal:(open:boolean) => void,
//     activeTabSet:string,
//     setActiveTabSet:(activeTabSet:string | undefined) => void,
//     setCanvasModel:(model:FlexLayout.IJsonModel) => void;
//     activePageId: string;
//     pageList: PageMetaInfoType[];
//     filters:GlobalFilters;
//     filterColor: LinkColor;
//     setFilters:(filters:GlobalFilters) => void;
//     setFilterColor:(filterColor:LinkColor) => void;
//     setIsPageUnsaved:(value:boolean) => void;
//     openWidgetAddModal: (flag: boolean) => void;
//     tdhModalState: boolean;
//     toggleTdhModal: (open: boolean) => void;
//     addPageModalState: boolean;
//     toggleAddPageModal: (open:boolean) => void;
//     selectedTheme: Theme;
// }
// export interface GlobalFilters {
//     [color:string]:Filter[]
// }
// interface IWidgetRefs {
//     [widgetId:string]: WidgetHandles
// }
// export const getInitialStateForGlobalFilters = ():GlobalFilters => {
//     const globalFilters:GlobalFilters = {};
//     linkColors.forEach((color:LinkColor) => {
//         globalFilters[color.type] = [];
//     });
//     return globalFilters;
// }
// const CanvasContainer = (props:CanvasContainerProps) => {   
//     const widgetServiceInstance = WidgetFactory.getInstance();
//     const canvasServiceInstance = CanvasFactory.getInstance();
//     const saveShortCutKey = useMemo(() => (['shift','s']),[]);
//     const duplicateShortCutKey = useMemo(() => (['shift','d']),[]);
//     const addWidgetShortCutKey = useMemo(() => (['shift','a']),[]);
//     const closeWidgetShortCutKey = useMemo(() => (['shift','f4']),[]);
//     const maximizeMinimizeShortCutKey = useMemo(() => (['shift','m']),[]);
//     const popOutShortCutKey = useMemo(() => (['shift','o']),[]);
//     const tdhShortCutKey = useMemo(() => (['shift','t']),[]);
//     const addPageShortCutKey = useMemo(() => (['shift','n']),[]);
//     const editWidgetShortCutKey = useMemo(() => (['shift','e']),[]);
//     const toolPanelToggleShortCutKeys = useMemo(() => (['shift','c']),[]);
//     const filterToggleShortCutKeys = useMemo(() => (['shift','f']),[]);
//     const [componentIdForEdit, setComponentIdForEdit] = useState<string | undefined>(undefined);
//     const [widgetPropsForEdit, setWidgetPropsForEdit] = useState<WidgetPropsType | undefined>(undefined);
//     const [openEditWidget, setopenEditWidget] = useState<boolean>(false);

//     const isPopout = useContext(PopoutContext);
//     const isModelChangedFirstTime = useRef<boolean>(false);

//     const widgetRefs = useRef<IWidgetRefs>({});
//     const flexLayoutRef = useRef<FlexLayout.Layout | null>(null);

//     useEffect(() => {
//         const styleElement = document.createElement('style');
//         styleElement.innerHTML = `.flexlayout__tab_button--selected::after {background-color: ${props.selectedTheme.color[0]};}`;
//         document.head.appendChild(styleElement);
//         if (props.selectedTheme.id === "0" || props.selectedTheme.name === "sample_theme") {
//             document.body.style.setProperty("--ag-row-hover-color", "#033956");
//             document.body.style.setProperty("--ag-balham-active-color", "#94b2d0");
//         } else {
//             document.body.style.setProperty("--ag-row-hover-color", props.selectedTheme.color[1]);
//             document.body.style.setProperty("--ag-balham-active-color", props.selectedTheme.color[0]);
//         }
//     }, [props.selectedTheme]);

//     const handleSave = useCallback(async () => {
//         if(!props.activePageId || !props.canvasModel) return;
//         const canvasService = CanvasFactory.getInstance();
//         const allWidgets = canvasService.getAllComponentsForPage(props.activePageId);
//         if(!allWidgets) return;
        
//         const promises:Promise<void>[] = [];
//         allWidgets.forEach(widget => {
//             promises.push(widgetRefs.current[widget]?.saveWidgetState());
//         })
//         await Promise.all(promises);

//         const widgetProps = canvasService.getAllComponentPropsForPage(props.activePageId);
//         const pageInfo = props.pageList.find(page => page.pageId === props.activePageId);
//         if(!widgetProps || !pageInfo) return;
//         canvasService.savePage(pageInfo,{
//             activeTabSet:props.activeTabSet,
//             canvasModel:props.canvasModel,
//             filterColor:props.filterColor,
//             filters:props.filters
//         },widgetProps,true);
//         props.setIsPageUnsaved(false);
//     },[props.activePageId,props.canvasModel,props.filterColor,props.filters])

//     useEffect(() => {
//         const eventEmitter = EventEmitterService.getInstance();
//         if(eventEmitter.listeners(PAGE_SAVE)) {
//             eventEmitter.removeAllListeners(PAGE_SAVE);
//         }
//         eventEmitter.addListener(PAGE_SAVE, handleSave);
//     }, [props.canvasModel]);

//     useKeyBoardShortCut(saveShortCutKey,() => {
//         const eventEmitter = EventEmitterService.getInstance();
//         eventEmitter.emit(PAGE_SAVE);
//     });
    
//     const handleDuplicate = useCallback(() => {
//         if(flexLayoutRef && flexLayoutRef.current){
//             const componentId = (flexLayoutRef.current?.props.model.getActiveTabset()?.getSelectedNode() as FlexLayout.TabNode ).getComponent();
//             if(componentId){
//                 duplicateWidget(componentId);
//             }
//         }
//     },[props.canvasModel,props.activePageId]);

//     useKeyBoardShortCut(duplicateShortCutKey,handleDuplicate);

    

//     const handleAddWidgetModelOpen = useCallback(() => {
//         props.toggleAddWidgetModal(true);
//     },[]);

//     useKeyBoardShortCut(addWidgetShortCutKey,handleAddWidgetModelOpen);
    

//     const handleCloseWidgetModelOpen = useCallback(() => {
//         if(flexLayoutRef && flexLayoutRef.current){
//             const tabsetNode = flexLayoutRef.current?.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 const tabNode = tabsetNode.getSelectedNode() as FlexLayout.TabNode; 
//                 if(tabNode) deleteTab(tabNode);
//                 if(tabsetNode.getChildren().length === 0)  props.setActiveTabSet(undefined); // if no children exists
//             }
//         }
//     },[]);

//     useKeyBoardShortCut(closeWidgetShortCutKey,handleCloseWidgetModelOpen);



//     const handleMaximizeMinimize = useCallback(() => {
//         if(flexLayoutRef && flexLayoutRef.current){
//             const tabsetNode = flexLayoutRef.current?.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 tabsetNode.getModel().doAction(FlexLayout.Actions.maximizeToggle(tabsetNode.getId()))
//             }
//         }
//     },[]);

//     useKeyBoardShortCut(maximizeMinimizeShortCutKey,handleMaximizeMinimize);
    

//     const handlePopOut = useCallback(() => {
//         if(!isPopout && flexLayoutRef && flexLayoutRef.current){
//             const tabsetNode = flexLayoutRef.current?.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 const popoutService = PopoutFactory.getInstance();
//                 const tabNode = (tabsetNode.getSelectedNode() as FlexLayout.TabNode);
//                 const componentId = tabNode.getComponent();
//                 if(componentId) popoutService.openTabAsPopout(componentId,tabNode.getName());
//             }
//         }
//     },[isPopout]);

//     useKeyBoardShortCut(popOutShortCutKey,handlePopOut, true);


//     const handleEditWidget = () => {
//         if(openEditWidget){
//             handleCloseEditWidget();
//         }
//         else if(flexLayoutRef.current){
//             const tabsetNode = flexLayoutRef.current.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 const tabNode = (tabsetNode.getSelectedNode() as FlexLayout.TabNode);
//                 const componentId = tabNode.getComponent();
//                 if(componentId){
//                     widgetRefs.current[componentId]?.saveWidgetState();
//                     const widgetProps = widgetServiceInstance.getProps(componentId);
//                     if(widgetProps){
//                         setWidgetPropsForEdit(widgetProps);
//                         setComponentIdForEdit(componentId);
//                         setopenEditWidget(true);
//                     }
//                 }
                
//             }
//         }
        
//     }
//     const handleExportWidget = useCallback(() => {
//         if(!flexLayoutRef.current) return;
//         const tabsetNode = flexLayoutRef.current.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 const tabNode = (tabsetNode.getSelectedNode() as FlexLayout.TabNode);
//                 const componentId = tabNode.getComponent();
//                 if(componentId){
//                     widgetRefs.current[componentId]?.saveWidgetState();
//                 }
                
//             }
//     },[])

//     const handleCloseEditWidget = () => {
//         setComponentIdForEdit(undefined);
//         setWidgetPropsForEdit(undefined);
//         setopenEditWidget(false);
//     }

//     useKeyBoardShortCut(editWidgetShortCutKey,handleEditWidget);

    

    

//     const handleToggleTDHModal = useCallback(() => {
//         props.toggleTdhModal(!props.tdhModalState);
//     },[props.tdhModalState]);

//     useKeyBoardShortCut(tdhShortCutKey,handleToggleTDHModal);
    

//     const handleToggleAddPageModal = useCallback(() =>{
//         props.toggleAddPageModal(!props.addPageModalState)
//     },[props.addPageModalState]);

//     useKeyBoardShortCut(addPageShortCutKey,handleToggleAddPageModal);
    
    
//     const handleToggleToolPanel = useCallback(() => {
//         if(flexLayoutRef.current){
//             const tabsetNode = flexLayoutRef.current?.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 const tabNode = (tabsetNode.getSelectedNode() as FlexLayout.TabNode);
//                 const componentId = tabNode.getComponent();
//                 if(componentId) toggleToolPanel(componentId);
//             }
//         }
        
//       },[])
    
    
//       useKeyBoardShortCut(toolPanelToggleShortCutKeys , handleToggleToolPanel);
    

//       const handleToggleFloatingFilter = useCallback(() => {
//         if(flexLayoutRef.current){
//             const tabsetNode = flexLayoutRef.current?.props.model.getActiveTabset() as FlexLayout.TabSetNode;
//             if(tabsetNode){
//                 const tabNode = (tabsetNode.getSelectedNode() as FlexLayout.TabNode);
//                 const componentId = tabNode.getComponent();
//                 if(componentId) toggleFloatingFilter(componentId);
//             }
//         }
        
//       },[])
    
//       useKeyBoardShortCut(filterToggleShortCutKeys , handleToggleFloatingFilter);
    

//     const getComponentFromType = (componentType:WIDGET_COMPONENTS) => {
//         console.log(componentType,"type")
//         console.log(WIDGET_COMPONENTS,"componentType")
//         switch(componentType) {
//             case WIDGET_COMPONENTS.GRID:
//                 return GridComponent;
//             case WIDGET_COMPONENTS.WATCHLIST:
//                 return WatchListComponent;
//             case WIDGET_COMPONENTS.SHEET:
//                 return SpreadSheetWrapper;
//             case WIDGET_COMPONENTS.CHART:
//                 return ChartWrapper;
//             case WIDGET_COMPONENTS.WEBPAGE:
//                 return WebPageComponent
//             case WIDGET_COMPONENTS.DEALINGPANELCHART:
//                 return DealingPanelChartWrapper;
//             case WIDGET_COMPONENTS.DEALINGPANELSHEET:
//                 return DealingPanelSpreadSheetWrapper;
//             case WIDGET_COMPONENTS.DEALING:
//                 return DealingPanelComponent;
//             case WIDGET_COMPONENTS.LOGINDEVICE:
//                 return LoginDevicePanelComponent;
//             case WIDGET_COMPONENTS.ALERTMANAGEMENT:
//                 return EventManagementComponent;
//             case WIDGET_COMPONENTS.REPORT:
//                 return ReportComponent;
//             case WIDGET_COMPONENTS.PROFITLOSSREPORT:
//                 return ProfitLossReport;
//             case WIDGET_COMPONENTS.ALERTNOTIFICATION:
//                 return AlertNotificationComponent;
//             default:
//                 return null;
//         }
//     }
//     useEffect(() => {
//         fetchThemes();
//         fetchSelectedTheme();
//         fetchTemplates();  
//     },[]);
//     useEffect(() => {
//         if(isModelChangedFirstTime.current) props.setIsPageUnsaved(true);
//     },[props.canvasModel])
//     useEffect(() => {
//         if(props.activePageId && isModelChangedFirstTime.current) {
//             props.setIsPageUnsaved(false);
//             isModelChangedFirstTime.current = false;
//         }
//     },[props.activePageId])

//     useEffect(() => {
//         const components = canvasServiceInstance.getAllComponentsForPage(props.activePageId);
//         components?.forEach(component => {
//             const widgetProps = widgetServiceInstance.getProps(component);
//             if(!widgetProps) return;
//                 widgetRefs.current[component]?.onGlobalFilterChange(props.filters[widgetProps.filterColor.type]);
//         })
//     },[props.filters])
//     useEffect(() => {
//         if(!flexLayoutRef.current) return;
//         flexLayoutRef.current.props.model.doAction(FlexLayout.Actions.setActiveTabset(props.activeTabSet));
//     },[props.activeTabSet])

//     const attachRef = useCallback((ref:any,componentId:string) => {
//         widgetRefs.current[componentId] = ref;
//     },[])
//     const onQuickFilterChange = (filterValue:string) => {
//         const components = canvasServiceInstance.getAllComponentsForPage(props.activePageId);
//         components?.forEach(component => {
//             widgetRefs.current[component]?.onQuickFilterChange(filterValue);
//         })
//     }
//     const addAdditionalProps = (componentType:WIDGET_COMPONENTS,componentId:string,componentProps:WidgetPropsType) => {
//         if(componentType === WIDGET_COMPONENTS.GRID || componentType === WIDGET_COMPONENTS.WATCHLIST || componentType === WIDGET_COMPONENTS.CHART){
//             componentProps.addToFilter = (colId:string,value:string) => addGlobalFilter(componentId,colId,value);
//             componentProps.onWidgetReady = () => {
//                 widgetRefs.current[componentId]?.onGlobalFilterChange(props.filters[componentProps.filterColor.type]);
//             }
//         }
//     }


//     const factory = useCallback((node:FlexLayout.TabNode) => {
//         const componentId = node.getComponent();
//         if(componentId) {
//             const componentType = widgetServiceInstance.getComponent(componentId);
//             if(componentType===undefined) return null;
//             const component = getComponentFromType(componentType);
//             const componentProps = widgetServiceInstance.getProps(componentId);
//             if(component && componentProps) {
//                 addAdditionalProps(componentType,componentId,componentProps)
//                 componentProps.ref = (ref:React.RefObject<ReactElement>) => attachRef(ref,componentId);
//                 return React.createElement(component,componentProps);
//             }
//         }
//         return null;
//     },[widgetServiceInstance,props.filters])

//     const onModelChange = useCallback((model:FlexLayout.Model) => {
//         const updatedModel = model.toJson();
//         props.setCanvasModel(updatedModel);
//        isModelChangedFirstTime.current = true;
//     },[])
    
//     const showAddWidgetModal = useCallback((tabSetId:string) => {
//         props.setActiveTabSet(tabSetId);
//         if(props.canvasModel.layout.children.length === 1 && props.canvasModel.layout.children[0].type === 'tabset' && props.canvasModel.layout.children[0].children.length === 0) {
//             // only when all the tabset are cleared and we add the new tabset
//             const newModel = cloneDeep(props.canvasModel);
//             newModel.layout.children[0].id = tabSetId;
//             props.setCanvasModel(newModel);
//         }
//         props.toggleAddWidgetModal(true);
//     },[props.canvasModel]);

//     const handleWidgetLink= (componentId:string | undefined,linkColor:LinkColor) => {
//         if(componentId === undefined) return;
//         const widgetProps = widgetServiceInstance.getProps(componentId);
//         if(widgetProps) {
//             widgetProps.filterColor = linkColor;
//             widgetRefs.current[componentId]?.onGlobalFilterChange(props.filters[linkColor.type]);
//         }
//     };
//     const deleteTab = (tabNode:FlexLayout.TabNode) => {
//         const component = tabNode.getComponent();
//         if(component) {
//             widgetRefs.current = {};
//             widgetServiceInstance.removeComponent(component);
//             canvasServiceInstance.removeComponentFromPage(props.activePageId,component);
//         }
//         tabNode.getModel().doAction(FlexLayout.Actions.deleteTab(tabNode.getId()));
//     }
//     const addGlobalFilter = (componentId:string,colId:string,value:string) => {
//         const widgetProps = widgetServiceInstance.getProps(componentId);
//         if(!widgetProps) return;
        
//         const filterColor = widgetProps.filterColor || linkColors[linkColors.length-1];
//         if(filterColor.type === 'unlink') return;
        
//         const newFilters = [...props.filters[filterColor.type]];
//         newFilters.push({colId,filterType:"==",value});
//         const filters = {...props.filters, [filterColor.type]:newFilters};
//         props.setFilters(filters);
        
//     }
//     const onFilterDelete = useCallback((colId:string,filterColor:LinkColor) => {
//         const filters = {...props.filters,[filterColor.type]:props.filters[filterColor.type].filter(x => x.colId !== colId)}
//         props.setFilters(filters);
//     },[props.filters]);
//     const onFilterColorChange = useCallback((newFilterColor:LinkColor) => {
//         props.setFilterColor(newFilterColor);
//     },[props.filterColor]);
    
//     const toggleToolPanel = useCallback((componentId:string) => {
//         widgetRefs.current[componentId]?.toggleToolPanel();
//     },[])

//     const toggleFloatingFilter = useCallback((componentId:string) => {
//         widgetRefs.current[componentId]?.toggleFloatingFilter();
//     },[])
//     const duplicateWidget = useCallback((componentId:string) => {
//        widgetRefs.current[componentId]?.saveWidgetState();
//        const newModel = canvasServiceInstance.duplicateWidget(props.canvasModel,componentId,props.activePageId);
//        props.setCanvasModel(newModel);
//     },[props.canvasModel])
//     const onRenderTab = (tabNode:FlexLayout.TabNode,values:FlexLayout.ITabRenderValues) => {
//         const componentId = tabNode.getComponent();
//         if(!componentId) return;
//         const widgetProps = widgetServiceInstance.getProps(componentId);
//         if(!widgetProps) return;
//         values.buttons.push(
//             <WidgetLink linkColor={widgetProps.filterColor} handleWidgetLink={(color:LinkColor)=> handleWidgetLink(tabNode.getComponent(),color)}/>
//         )
//         const tabsetnode = tabNode.getParent() as FlexLayout.TabSetNode;
//         const display : boolean = tabNode.getId() === tabsetnode.getSelectedNode()?.getId();
//         values.buttons.push(
//             <IconButton size='small'  sx={{p:0, display : display ? "inline-flex" : "none"}} onMouseDown={e => {
//                 const tabSet = tabNode.getParent();
//                 deleteTab(tabNode);
//                 if(tabSet && tabSet.getChildren().length === 0)  props.setActiveTabSet(undefined); // if no children exists
//                 if(tabNode.getParent())
//                 e.stopPropagation();
//             }}>
//                 <CloseIcon sx={{fontSize : 15}} htmlColor='#6A7187'/>
//             </IconButton>
//         )
        
//     }

//     const handleOnAction = (action: FlexLayout.Action): FlexLayout.Action | undefined => {
//         return action;
//     }

//     const onRenderTabSet = (tabSetNode:FlexLayout.TabSetNode | FlexLayout.BorderNode, values:FlexLayout.ITabSetRenderValues) => {
//         const isIconVisible = tabSetNode.getRect().width > 300;
//         if (isIconVisible) {

//         values.buttons.push(
//             <Tooltip title={
//                 <span style={{ whiteSpace: 'pre' }}>
//                     Add  Shift + A
//                 </span>
//             }>
//                 <IconButton size='small' sx={{p:0}} onMouseDown={() => showAddWidgetModal(tabSetNode.getId())}>
//                 <AddTwoTone sx={{color:'#6A7187',cursor:'pointer'}}  />
//                 </IconButton>
//             </Tooltip>
            
//         );
//         values.buttons.push(
//             <Tooltip title={ 
//                 <span style={{ whiteSpace: 'pre' }}>
//                     {tabSetNode.isMaximized() ? "Minimize" : "Maximize"}    Shift + M
//                 </span>
//             } >
//             <IconButton size='small' sx={{p:0}} onClick={(e)=> {tabSetNode.getModel().doAction(FlexLayout.Actions.maximizeToggle(tabSetNode.getId()))}}>
                
//                 {tabSetNode.isMaximized()?
//                     <CloseFullscreen htmlColor='#6A7187' fontSize='small'/>
//                     :<OpenInFull htmlColor='#6A7187' fontSize='small'/>
//                 }
//             </IconButton>
//             </Tooltip>
//         )
//         if(!isPopout) {
//             values.buttons.push(
//                 <Tooltip title="Popout &nbsp;&nbsp; shift + O">
//                     <IconButton size='small' sx={{pr:0}} onClick={() => {
//                         const popoutService = PopoutFactory.getInstance();
//                         const tabNode = (tabSetNode.getSelectedNode() as FlexLayout.TabNode);
//                         const componentId = tabNode.getComponent();
//                         if(componentId) popoutService.openTabAsPopout(componentId,tabNode.getName());
//                     }}>
//                         <OpenInNew htmlColor='#6A7187' fontSize='small' sx={{mt:'2px'}}/>
//                     </IconButton>
//                 </Tooltip>  
//             )
//         }
//     }
//         const selectedTabNode = (tabSetNode.getSelectedNode() as FlexLayout.TabNode);
//         const selectedTabNodeComponentId = selectedTabNode.getComponent();
//         if(!selectedTabNodeComponentId) return;
//         const widgetProps = widgetServiceInstance.getProps(selectedTabNodeComponentId);
//         if(!widgetProps) return;
    
        
//         values.buttons.push(
//             <WidgetMenu
//                 handleEditWidget = {handleEditWidget}
//                 tabsetId = {tabSetNode.getId()}
//                 widgetType = {widgetProps.componentType}
//                 componentId={selectedTabNodeComponentId}
//                 toogleToolPanel={toggleToolPanel}
//                 toggleFloatingFilter={toggleFloatingFilter}
//                 duplicateWidget={duplicateWidget}
//                 closeWidget={() => {
//                     deleteTab(selectedTabNode)}
//                 }
//                 handleExportWidget={handleExportWidget}
                
//                 isIconVisible={isIconVisible}
//                 handleAddWidgetModal={showAddWidgetModal}
//                 isMaximized={tabSetNode.isMaximized()}
//                 tabSetModel={tabSetNode.getModel()}
//                 isPopout={isPopout}
//                 tabSetNode={tabSetNode}
//             />)
//     }


//     if(props.canvasModel !== null && props.canvasModel.layout.children[0].children.length === 0) {
//         // if no widget is present (page is blank)
//         return <AddWidgetOnBlankPage/>
//     }
//     // (property) onAction?: ((action: FlexLayout.Action) => FlexLayout.Action | undefined) | undefined

//     // const handleOnAction = (action: FlexLayout.Action) => FlexLayout.Action | undefined => {}
//     console.log(props.canvasModel,"props.canvasModel")
 

//     return (
//         <>
//             <FilterBar 
//                 filters={props.filters[props.filterColor.type]}
//                 filterColor={props.filterColor}
//                 onFilterDelete={onFilterDelete}
//                 onFilterColorChange={onFilterColorChange}
//                 onQuickFilterChange={onQuickFilterChange}
//             />
//             {props.canvasModel === null ? <Loader size={40}/> :
//             <FlexLayout.Layout
//                 ref={flexLayoutRef}
//                 model={FlexLayout.Model.fromJson(props.canvasModel)}
//                 onModelChange={onModelChange}
//                 factory={factory}
//                 onRenderTab={onRenderTab}
//                 onRenderTabSet={onRenderTabSet}
//                 onAction={handleOnAction}
//                 supportsPopout
//                 icons={{
//                     maximize:null,
//                     restore:null,
//                     popout:null
//                 }}
//             />
//             }{openEditWidget && widgetPropsForEdit && componentIdForEdit &&(
//                 <AddCustomWidgetModal  open={openEditWidget} isEdit={openEditWidget} componentId={componentIdForEdit} widgetType={widgetPropsForEdit.componentType} onClose={handleCloseEditWidget}/>
//             )}
            
//         </>
//     )
// }
// function mapStateToProps(state:any) {
//     return {
//         activeTabSet:state.canvas.activeTabSet,
//         canvasModel:state.canvas.canvasModel,
//         canvasState:state.canvas,
//         activePageId: state.page.activePageId,
//         pageList: state.page.pages,
//         filters:state.canvas.filters,
//         filterColor: state.canvas.filterColor,
//         tdhModalState: state.app.tdhModalState,
//         addPageModalState: state.app.addPageModalState,
//         selectedTheme: state.app.selectedTheme
//     }
// }
// function mapDispatchToProps(dispatch:Dispatch) {
//     return {
//         toggleAddWidgetModal:(open:boolean) => dispatch(openAddWidgetModal(open)),
//         setActiveTabSet:(activeTabSet:string | undefined) => dispatch(setActiveTabSet(activeTabSet)),
//         setCanvasModel:(model:FlexLayout.IJsonModel) => dispatch(setCanvasModel(model)),
//         setFilters:(filters:GlobalFilters) => dispatch(setFilters(filters)),
//         setFilterColor:(filterColor:LinkColor) => dispatch(setFilterColor(filterColor)),
//         setIsPageUnsaved:(value:boolean) => dispatch(setIsPageUnsaved(value)),
//         openWidgetAddModal: (flag: boolean) => dispatch(openAddWidgetModal(flag)),
//         toggleTdhModal: (open: boolean) => dispatch(toggleTdhModal(open)),
//         toggleAddPageModal: (open:boolean) => dispatch(toogleAddPageModal(open)),
//     }
// }
// export default React.memo(connect(mapStateToProps,mapDispatchToProps)(CanvasContainer));