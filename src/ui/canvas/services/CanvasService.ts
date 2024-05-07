import { IJsonModel, IJsonRowNode, IJsonTabSetNode } from "flexlayout-react";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import { sendMessage, setAlertMessage } from "../../../redux/action-handlers/app/AppActions";
import { WidgetConfigsType } from "../../components/custom-widget/WidgetConfig";
import { getWidgetType } from "../../components/widgets/utilities/WidgetUtilities";
import { CanvasState } from "../CanvasContainer";
import WidgetFactory, { WidgetPropsType } from "./WidgetService";
// import { Oreka as FetchLoginUserWiseDataRequest } from "../../../proto/FetchLoginUserWiseDataRequest";
// import { Oreka as ClientMessage } from "../../../proto/clientmessage";
// import { Oreka as FetchPageDetails} from "../../../proto/FetchPageDetails";
// import { Oreka as DeletePage } from "../../../proto/DeletePage";
// import { Oreka as SavePage } from "../../../proto/SavePage";
import Page from "../../components/page/Page";

export type PageMetaInfoType = {
  pageId: string;
  name: string;
  shortName: string;
  sequence: number;
};
export type Page = {
  pageId: string;
  name: string;
  shortName: string;
  canvasModel: IJsonModel;
};
export const DefaultCanvasModel: IJsonModel = {
  global: {
    splitterSize: 4,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        id: "tab-1",
        weight: 50,
        children: [],
      },
    ],
  },
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
class CanvasService {
  private pageToSetOfComponents: Map<string, Set<string>>;
  private widgetService;

  constructor() {
    this.pageToSetOfComponents = new Map<string, Set<string>>();
    this.widgetService = WidgetFactory.getInstance();
  }
  addNewPage() {
    const pageId = uuidv4();
    this.pageToSetOfComponents.set(pageId, new Set([]));
    return pageId;
  }
  deletePage(pageId: string) {
    const widgets = this.pageToSetOfComponents.get(pageId);
    widgets?.forEach((widget) => {
      this.widgetService.removeComponent(widget);
    });
    this.pageToSetOfComponents.delete(pageId);
    const request = DeletePage.DeletePage.fromObject({type: ReducerConstants.DELETE_PAGE, pageId: pageId,});
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.deletepage = request;
    const buf = clientMessage.serializeBinary();
    sendMessage(buf);
  }

  addToModel(
    pageId: string,
    model: IJsonModel,
    tabSetId: string,
    panelName = "untitled",
    widgetProps: WidgetPropsType
  ): IJsonModel {
    if (!this.pageToSetOfComponents.has(pageId)) return model;
    console.log(widgetProps,"widgetPropswidgetProps")
    let data = widgetProps.name === "Login device panel" ? "logindevice" : widgetProps.componentType;
    const widgetType = getWidgetType(data);
    const widgetId = this.widgetService.addComponent(widgetType);
    widgetProps.id = widgetId;
    this.widgetService.setProps(widgetId, widgetProps);

    this.addComponentToPage(pageId, widgetId);

    const newModel = cloneDeep(model);
    let found = false;
    newModel.layout.children.forEach((child) => {
      if (found) return;
      found ||= this.updateModel(tabSetId, widgetId, panelName, child);
    });
    // // add model to first tabset in case active tabset not found
    // if(!found && newModel.layout.children[0].id) this.updateModel(newModel.layout.children[0].id,widgetId,panelName,newModel.layout.children[0]);
    return newModel;
  }
  removeComponentFromPage(pageId: string, componentId: string) {
    const pageComponents = this.pageToSetOfComponents.get(pageId);
    if (pageComponents) {
      pageComponents.delete(componentId);
      // if(pageComponents.size === 0) this.pageToSetOfComponents.delete(pageId);
    }
  }
  private addComponentToPage(pageId: string, componentId: string) {
    let setOfComponents = this.pageToSetOfComponents.get(pageId);
    if (setOfComponents) setOfComponents.add(componentId);
  }
  private updateModel(
    tabSetId: string,
    componentId: string,
    panelName: string,
    model: IJsonRowNode | IJsonTabSetNode
  ): boolean {
    if (model.type === "tabset" && model.id === tabSetId) {
      model.selected = model.children.length === 0 ? 0 : model.children.length;
      model.active = true;
      model.children.push({
        type: "tab",
        name: panelName,
        component: componentId,
      enableFloat: true,
        enableClose: false,
      });
      return true;
    }
    let found = false;
    if (model.type === "row") {
      model.children.forEach((child) => {
        if (found) return;
        found ||= this.updateModel(tabSetId, componentId, panelName, child);
      });
    }
    return found;
  }
  getAllComponentsForPage(pageId: string): string[] | null {
    const components = this.pageToSetOfComponents.get(pageId);
    if (components) return Array.from(components);
    return null;
  }
  getAllComponentPropsForPage(
    pageId: string
  ): { [id: string]: WidgetConfigsType } | null {
    const widgets = this.pageToSetOfComponents.get(pageId);
    if (!widgets) return null;
    const widgetProps: { [id: string]: WidgetConfigsType } = {};
    widgets.forEach((widget) => {
      const props = this.widgetService.getProps(widget);
      if (!props) return;
      widgetProps[widget] = props;
    });
    return widgetProps;
  }
  async savePage(
    page: PageMetaInfoType,
    canvasState: CanvasState,
    widgetProps: { [id: string]: WidgetConfigsType },
    update = false
  ) {
    // if page id exists and it is not a popup window then only save the page
    if (this.pageToSetOfComponents.has(page.pageId) && window.opener === null) {
      try {
          const request = SavePage.SavePage.fromObject({
            type: update ? ReducerConstants.UPDATE_PAGE : ReducerConstants.SAVE_PAGE,
            page: {
              name: page.name,
              pageId: page.pageId,
              shortName: page.shortName,
              layout: JSON.stringify(canvasState),
              widgetConfigs: JSON.stringify(widgetProps)
            },
          });
          
          const clientMessage = new ClientMessage.ClientMessage({
            type:update ? ReducerConstants.UPDATE_PAGE : ReducerConstants.SAVE_PAGE,
            savepage:request
          });
          console.log("### clientMessage ###", clientMessage.toObject());

          const buf = clientMessage.serializeBinary();
          // const res = await fetch(
          //   `${API_BASE_URL}/UploadFile/api/savepage/WriteToFile`,
          //   {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body:JSON.stringify(body),
          //   }
          // );
          // if(res.ok) {
          sendMessage(buf);
          // const data = await res.json();
          // store.dispatch(setAlertMessage(data.responseMessage,"success"));
          // }
          // else {
          //   store.dispatch(setAlertMessage("Page not updated","error"));
          // }
        // } else{
        //   const request = SavePage.SavePage.fromObject({
        //     type: ReducerConstants.SAVE_PAGE,
        //     page: {
        //       name: page.name,
        //       pageId: page.pageId,
        //       shortName: page.shortName,
        //     },
        //   });
        //   const clientMessage = new ClientMessage.ClientMessage();
        //   clientMessage.savepage = request;
        //   clientMessage.type = ReducerConstants.SAVE_PAGE;
        //   const buf = clientMessage.serializeBinary();
        //   sendMessage(buf);
        // }
      } catch(error) {
        console.error("error:",error);
      }
    }
  }
  fetchPageDetails(pageId: string, userId: string) {
    const request = FetchPageDetails.FetchPageDetails.fromObject({type: ReducerConstants.FETCH_PAGE_DETAILS, loginUser: userId, pageId: pageId});
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.fetchpagedetails = request;
    clientMessage.type = ReducerConstants.FETCH_PAGE_DETAILS;
    const buf = clientMessage.serializeBinary();
    sendMessage(buf);
  }
  addAllWidgetsToPage(
    pageId: string,
    widgetProps: { [id: string]: WidgetConfigsType }
  ) {
    const setOfWidgets = new Set<string>();
    this.widgetService.removeAllComponents();
    for (const key in widgetProps) {
      setOfWidgets.add(key);
      this.widgetService.setComponent(
        key,
        getWidgetType(widgetProps[key].componentType)
      );
      this.widgetService.setProps(key, widgetProps[key] as WidgetPropsType);
    }
    this.pageToSetOfComponents.set(pageId, setOfWidgets);
  }
  fetchPageList(userId: string) {
    const request = FetchLoginUserWiseDataRequest.FetchLoginUserWiseDataRequest.fromObject({type: ReducerConstants.FETCH_PAGE_LIST, loginUser: userId});
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.typeandloginrequest = request;
    const buf = clientMessage.serializeBinary();
    sendMessage(buf);
  }
  addPopoutComponentToCanvasModel(widgetId: string, panelName: string) {
    const model = cloneDeep(DefaultCanvasModel);
    const tabSetNode = model.layout.children[0];
    if (tabSetNode.type === "tabset") {
      tabSetNode.children.push({
        type: "tab",
        name: panelName,
        component: widgetId,
        enableFloat: true,
        enableClose: false,
      });
    }
    return model;
  }
  duplicateWidget(model: IJsonModel, widgetId: string, pageId: string) {

    let newModel = model;
    let isFound = false;
    const findWidget = (node: IJsonRowNode | IJsonTabSetNode) => {
      if (isFound) return;
      node.children.forEach((child) => {
        if (isFound) return;
        if (child.type && child.type === "tab" && node.type === "tabset") {
          if (child.component === widgetId) {
            const parentTabSetId = node.id;
            const widgetProps = JSON.parse(
              JSON.stringify(this.widgetService.getProps(widgetId))
            );
            if (parentTabSetId && widgetProps) {
              newModel = this.addToModel(
                pageId,
                model,
                parentTabSetId,
                child.name,
                widgetProps
              );
              isFound = true;
            }
          }
        } else findWidget(child as IJsonRowNode | IJsonTabSetNode);
      });
    };
    model.layout.children.forEach((child) => {
      findWidget(child);
    });
    return newModel;
  }
}
let canvasServiceInstance: CanvasService | null = null;
const CanvasFactory = {
  getInstance(): CanvasService {
    if (!canvasServiceInstance) {
      canvasServiceInstance = new CanvasService();
    }
    return canvasServiceInstance;
  },
};

export default CanvasFactory;
