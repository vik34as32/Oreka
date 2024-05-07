import { DataType } from "../../../../backend/worker/DataWorker";
import { WIDGET_COMPONENTS } from "../../../canvas/services/WidgetService";
import { Filter } from "../../custom-widget/WidgetConfig";
import { FilterType } from "../../custom-widget/drag-drop/FilterItemList";

function getWidgetType(type:string) {
    switch(type) {
        case "grid":
            return WIDGET_COMPONENTS.GRID;
        case "watchlist":
            return WIDGET_COMPONENTS.WATCHLIST;
        case "alert-notification":
            return WIDGET_COMPONENTS.ALERTNOTIFICATION;
        case "event-management":
            return WIDGET_COMPONENTS.ALERTMANAGEMENT;
        case "spreadsheet":
            return WIDGET_COMPONENTS.SHEET; 
        case "chart":
            return WIDGET_COMPONENTS.CHART;
        case "webpage":
            return WIDGET_COMPONENTS.WEBPAGE;
        case "dealing-panel-chart":
            return WIDGET_COMPONENTS.DEALINGPANELCHART;
        case "dealing-panel-spreadsheet":
            return WIDGET_COMPONENTS.DEALINGPANELSHEET;
        case "dealing":
            return WIDGET_COMPONENTS.DEALING;
        case "report":
            return WIDGET_COMPONENTS.REPORT;
        case "profit-loss-report":
            return WIDGET_COMPONENTS.PROFITLOSSREPORT;

        case "logindevice":
                return WIDGET_COMPONENTS.LOGINDEVICE;    
        default:
            return WIDGET_COMPONENTS.CHART;
    }
}
export type FilterFunctionType = (filter:Filter,data:DataType) => boolean;

function applyFilters(filters:Filter[], data:DataType[]):DataType[] {
    if(filters.length === 0) return data;
    
    const filteredData:DataType[] = [];
    const filterFunctions:{filter:Filter,filterFunction:FilterFunctionType}[] = [];
    filters.forEach(filter => {
        const func = getFilterFunction(filter.filterType);
        filterFunctions.push({filter,filterFunction:func});
    });
    data.forEach(row => {
        let res = true;
        filterFunctions.forEach(({filter,filterFunction}) => {
            res&&=filterFunction(filter,row);
        })
        if(res) filteredData.push(row);
    })
    return filteredData;
}
function equals(filter:Filter,data:DataType):boolean {
    return data[filter.colId]!==undefined && data[filter.colId] === filter.value;
}
function notEquals(filter:Filter,data:DataType):boolean {
    return data[filter.colId]!==undefined && data[filter.colId] !== filter.value;
}
function lessThan(filter:Filter,data:DataType):boolean {
    return data[filter.colId] < filter.value;
}
function greaterThan(filter:Filter,data:DataType):boolean {
    return data[filter.colId] > filter.value;
}
function lessThanEquals(filter:Filter,data:DataType):boolean {
    return data[filter.colId] <= filter.value;
}
function greaterThanEquals(filter:Filter,data:DataType):boolean {
    return data[filter.colId] >= filter.value;
}
function beginsWith(filter:Filter,data:DataType):boolean {
    return data[filter.colId]!==undefined && typeof filter.value === "string" && typeof data[filter.colId] === "string" && (data[filter.colId] as string).startsWith(filter.value);
}
function endsWith(filter:Filter,data:DataType):boolean {
    return data[filter.colId]!==undefined && typeof filter.value === "string" && typeof data[filter.colId] === "string" && (data[filter.colId] as string).endsWith(filter.value);
}
function contains(filter:Filter,data:DataType):boolean {
    return data[filter.colId]!==undefined && typeof filter.value === "string" && typeof data[filter.colId] === "string" && (data[filter.colId] as string).indexOf(filter.value) !== -1;
}
function notContains(filter:Filter,data:DataType):boolean {
    return data[filter.colId]!==undefined && typeof filter.value === "string" && typeof data[filter.colId] === "string" &&(data[filter.colId] as string).indexOf(filter.value) === -1;
}
function isNullOrBlank(filter:Filter,data:DataType):boolean {
    return data[filter.colId] === null || typeof filter.value === "string" && data[filter.colId] === "";
}
function isNotNullOrNotBlank(filter:Filter,data:DataType):boolean {
    return data[filter.colId] !== null && (typeof filter.value !== "string" || data[filter.colId] !== "");
}
function getFilterFunction(filterType:FilterType):FilterFunctionType {
    switch(filterType) {
        case "==":
            return equals;
        case "!=":
            return notEquals;
        case "<":
            return lessThan;
        case ">":
            return greaterThan;
        case "<=":
            return lessThanEquals;
        case ">=":
            return greaterThanEquals;
        case "begins with":
            return beginsWith;
        case "ends with":
            return endsWith;
        case "contains":
            return contains;
        case "not contains":
            return notContains;
        case "is null":
            return isNullOrBlank;
        case "is not null":
            return isNotNullOrNotBlank;
        default:
            return equals;
    }
}
export {getWidgetType, applyFilters};