import { v4 as uuidv4 } from "uuid";
import { Filter, WidgetConfigsType } from "../../components/custom-widget/WidgetConfig";
import { ReactElement } from "react";
import { WatchListPropsType } from "../../components/widgets/watch-list/WatchListComponent";
import { DataColumn } from "../../../redux/reducers/canvas/CanvasReducer";
import {SpreadSheetComponentProps} from "../../components/widgets/spreadsheet/SpreadSheetComponent";
import { DealingPanelPropsType } from "../../components/widgets/DealingPanelComponent";
import {LoginPanelPropsType} from "../../components/widgets/LoginDevicePanelComponent";
import { ProfitLossReportProps } from "../../components/widgets/ProfitLossReport/ProfitLossReport";
export enum WIDGET_COMPONENTS {
    GRID,
    SHEET,
    CHART,
    WATCHLIST,
    WEBPAGE,
    DEALINGPANELCHART,
    DEALINGPANELSHEET,
    DEALING,
    ALERTMANAGEMENT,
    REPORT,
    PROFITLOSSREPORT,
    ALERTNOTIFICATION,
    LOGINDEVICE
}
export type DataColumnPropertyMap = {
    [colId:string]:DataColumn
}
export interface WidgetProps extends WidgetConfigsType{
    ref?:ReactElement | ((ref:React.RefObject<ReactElement>) => void),
    onWidgetReady?:() => void;
}
export type WidgetHandles = {
    onGlobalFilterChange:(globalFilters:Filter[]) => void;
    saveWidgetState:() => Promise<void>;
    onQuickFilterChange:(filterValue:string) => void;
    toggleToolPanel:() => void;
    toggleFloatingFilter:() => void;
}
export type WidgetPropsType = WidgetProps & WatchListPropsType & SpreadSheetComponentProps & DealingPanelPropsType & ProfitLossReportProps &LoginPanelPropsType;
class WidgetService {
    widgetToComponentMap:Map<string,WIDGET_COMPONENTS>
    widgetToPropsMap:Map<string,WidgetPropsType>
    constructor() {
        this.widgetToComponentMap = new Map<string,WIDGET_COMPONENTS>();
        this.widgetToPropsMap = new Map<string,WidgetPropsType>();
    }
    addComponent(type:WIDGET_COMPONENTS):string {
        const id = uuidv4();
        this.widgetToComponentMap.set(id,type);
        return id;
    }
    setComponent(widgetId:string,type:WIDGET_COMPONENTS) {
        this.widgetToComponentMap.set(widgetId,type);
    }
    setProps(id:string,props:WidgetPropsType) {
        if(this.widgetToComponentMap.has(id)) this.widgetToPropsMap.set(id,props);
    }
    getProps(id:string):WidgetPropsType | undefined {
        return this.widgetToPropsMap.get(id);
    }
    getComponent(id:string):WIDGET_COMPONENTS | undefined {
        return this.widgetToComponentMap.get(id);
    }
    removeComponent(id:string) {
        this.widgetToComponentMap.delete(id);
        this.widgetToPropsMap.delete(id);
    }
    removeAllComponents() {
        this.widgetToComponentMap.clear();
        this.widgetToPropsMap.clear();
    }
    
}


let widgetServiceInstance: WidgetService | null = null;
const WidgetFactory = {
  getInstance():WidgetService {
    if (!widgetServiceInstance) {
        widgetServiceInstance = new WidgetService();
    }
    return widgetServiceInstance;
  },
};

export default WidgetFactory;

