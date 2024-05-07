// import { IJsonModel } from "flexlayout-react";
// import { Dispatch } from "redux";
// import { ReducerActionConstants, ReducerConstants } from "../../../config/reducers/ReducerConstants";
// import { GlobalFilters } from "../../../ui/canvas/CanvasContainer";
// import { LinkColor } from "../../../ui/components/common/widget-link/WidgetLink";


// export function fetchData(canvas: any, login: string, time: number | undefined): { type: string; requestType: any; tabs: [string]; loginUser: string, time: number }[] {
//     var datasourceVsActiveColumnsMapping = new Set<string>()
//     canvas["reference_components"].forEach((item: any) => {
//         var detail = item.details;
//         var datasource = detail.datasource;
//         datasourceVsActiveColumnsMapping.add(datasource.subscriptionMessage)
//     });

//     var activeColumnsEvents: { type: string; requestType: any; tabs: [string]; loginUser: string, time: number }[] = []
//     datasourceVsActiveColumnsMapping.forEach((key: string) => {
//         activeColumnsEvents.push({
//             "type": "SECTION_MAIN_TABS_DATA_REQUEST",
//             "requestType": key,
//             "tabs": [key],
//             "loginUser": login,
//             "time": Math.floor((time ?? Date.now()) / 1000)
//         })
//     });

//     return activeColumnsEvents
// }

// export function fetchCanvas(dispatcher: Dispatch<any>, login: string) {
//     return dispatcher({
//         "type": ReducerConstants.FETCH_CANVAS
//     })
// }

// function checkInnerTabs(item: any): any[] {
//     var result: any[] = []
//     if (item.type == "row") {
//         item.children?.forEach((child: any) => {
//             if (child.type == "row") {
//                 var resultSet = checkInnerTabs(child);
//                 if (resultSet != undefined && resultSet.length > 0) {
//                     result.push(...resultSet)
//                 }
//             }
//             if (child.type == "tabset") {
//                 if (child.selected != undefined)
//                     result.push(child.children[child.selected])
//                 else
//                     result.push(child.children[0])
//             }
//         })
//     }
//     if (item.type == "tabset") {
//         if (item.selected != undefined)
//             result.push(item.children[item.selected])
//         else
//             result.push(item.children[0])
//     }
//     return result
// }

// export function prepActiveColumns(canvas: any, login: string): { type: string; columns: any; loginUser: string; requesttype: any }[] {
//     var datasourceVsActiveColumnsMapping = new Map<string, any>()

//     var selectedTabs: any[] = []
//     canvas['layout']['children'].forEach((item: any, index: number) => {
//         var result = checkInnerTabs(item);
//         if (result != undefined && result.length > 0) {
//             selectedTabs.push(...result)
//         }
//     })

//     canvas["reference_components"].forEach((item: any, index: number) => {
//         var checkIfExists = selectedTabs.filter(selectedTab => selectedTab.id == item.id)
//         if (checkIfExists != undefined && checkIfExists.length > 0) {
//             var detail = item.details;
//             var datasource = detail.datasource;
//             var group_by = detail.group_by;
//             var visible_cols = detail.visible_cols;
//             var function_cols = detail.function_cols;
//             var color_by = detail.color_by;
//             var split_by = detail.split_by;
//             var filter_by = detail.filter_by;

//             if (datasourceVsActiveColumnsMapping.has(datasource.subscriptionMessage)) {
//                 var activeColumns = new Set([...datasourceVsActiveColumnsMapping.get(datasource.subscriptionMessage), ...group_by, ...visible_cols, ...Object.keys(function_cols), ...color_by, ...filter_by, ...split_by])

//                 datasourceVsActiveColumnsMapping.set(datasource.subscriptionMessage, activeColumns)
//             } else {
//                 var activeColumns = new Set([...group_by, ...visible_cols, ...Object.keys(function_cols), ...color_by, ...filter_by, ...split_by])

//                 datasourceVsActiveColumnsMapping.set(datasource.subscriptionMessage, activeColumns)
//             }
//         }
//     });


//     var activeColumnsEvents: { type: string; columns: any; loginUser: string; requesttype: any }[] = []

//     return activeColumnsEvents
// }

// export function addWidgetEvent(generateNewId: string, details: AddWidgetDataModelProperties) {
//     return {
//         type: ReducerActionConstants.AddWidgetInCanvasAction,
//         details: details,
//         id: generateNewId,
//     }
// }

// export function updateServerWithActiveColumnChange(model: any, loginId: any, dispatch: any) {
//     dispatch({
//         type: ReducerActionConstants.UpdateCanvasModel,
//         model: model
//     });
// }

// export function setCanvasModel(model:IJsonModel) {

   
//      let data = {
//         type:ReducerConstants.SET_CANVAS_MODEL,
//         canvasModel:model
//     }
//      console.log(data,"hello codee")
//     return data 
// }

// export function resetCanvasState() {
//     return {
//         type:ReducerConstants.RESET_CANVAS_STATE
//     }
// }
// export function setFilters(filters:GlobalFilters) {
//     return {
//         type:ReducerConstants.SET_CANVAS_FILTERS,
//         filters
//     }
// }
// export function setFilterColor(filterColor:LinkColor) {
//     return {
//         type:ReducerConstants.SET_CANVAS_FILTER_COLOR,
//         filterColor
//     }
// }