import { POPOUT_SERVICE_EVENT_SOURCE, POPOUT_WINDOW_CLOSE, POPOUT_WINDOW_EVENT_SOURCE, POPOUT_WINDOW_READY } from "../../../utilities/Constants";
import WidgetFactory from "./WidgetService";
import { v4 as uuidv4 } from "uuid";
interface PopoutWindowMessage {
  source:string;
  windowId:string;
  type:string;
}
interface PopoutInfo {
  window:Window,
  widgetId:string;
  panelName:string;
}
class PopoutService {
    private widgetService;
    private windowsMap:Map<string,PopoutInfo>;
    constructor() {
        this.widgetService = WidgetFactory.getInstance();
        this.windowsMap = new Map<string,PopoutInfo>();
        window.addEventListener("message",this.onPopoutMessageReceived.bind(this));
        window.addEventListener("beforeunload",this.closeAllPopoutWindows.bind(this));
    }
    private onPopoutMessageReceived(event:MessageEvent) {
      if(event.origin === window.location.origin && event.data.source === POPOUT_WINDOW_EVENT_SOURCE) {
        const data:PopoutWindowMessage = event.data;
        switch(data.type) {
          case POPOUT_WINDOW_READY:
            this.sendPopoutWidgetData(data.windowId);
            break;
          case POPOUT_WINDOW_CLOSE:
            this.onPopoutWindowClose(data.windowId);
            break;
        }
      }
    }
    private onPopoutWindowClose(windowId:string) {
      this.windowsMap.delete(windowId);
    }
    private sendPopoutWidgetData(windowId:string) {
      const popoutInfo = this.windowsMap.get(windowId);
      if (!popoutInfo) return;
      const widgetProps = this.widgetService.getProps(popoutInfo.widgetId);
      if (widgetProps) {
        popoutInfo.window.postMessage(
          {
            source: POPOUT_SERVICE_EVENT_SOURCE,
            payload: JSON.stringify({
              panelName: popoutInfo.panelName,
              widgetId: popoutInfo.widgetId,
              widgetProps,
            }),
          },
          window.location.origin
        );
      }
    }
    openTabAsPopout(componentId: string,panelName:string) {
        const windowId = uuidv4();

        const externalWindow = window.open(
          window.location.href,
          windowId,
          "width=700,height=500,left=100,top=100"
        );
        if(!externalWindow) return;
        this.windowsMap.set(windowId,{
          window:externalWindow,
          panelName,
          widgetId:componentId
        });
    }
    private closeAllPopoutWindows() {
      this.windowsMap.forEach((popout,windowId) => {
        popout.window.close();
      })
      this.windowsMap.clear();
    }
}

let popoutServiceInstance: PopoutService | null = null;
const PopoutFactory = {
  getInstance():PopoutService {
    if (!popoutServiceInstance) {
        popoutServiceInstance = new PopoutService();
    }
    return popoutServiceInstance;
  },
};

export default PopoutFactory;
