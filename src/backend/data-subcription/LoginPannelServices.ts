import { v4 as uuidv4 } from 'uuid';
import { LoginPanelSubscriber, deregisterLoginDevicePanel, registerLoginDevicePanel, setActiveColumnsForDataSource, updateLoginPanelSubscription } from '../../redux/action-handlers/app/AppActions';
import { dataSources } from '../../redux/reducers/canvas/CanvasReducer';

class LoginPanelServices {
    private subscriptionIdCallBackMap: Map<string, IOnDataRecieve>;
    private activeColumns: Set<string>;
    
    constructor() {
        this.subscriptionIdCallBackMap = new Map<string, IOnDataRecieve>();
        //debugger
        const dataSource = dataSources.find(ds => ds.id === "login-device-panel");
        if (dataSource) {
            let columns = new Set<string>();
            dataSource.columns.forEach((col) => {
                if ("field" in col) {
                    columns.add(col.field)
                }
            })
            this.activeColumns = columns;
        } else {
            this.activeColumns = new Set<string>([ "time", "ip", "login", "deviceid"]);
        }

    }

    getNewSubscriptionId() {
        return uuidv4();
    }

    subscribe(subscriptionId: string, callBack: IOnDataRecieve, startTime?: number, endTime?: number): string | null {   // subscribe to dataSource

        const subscriber = this.getSubscriber();
        
        this.subscriptionIdCallBackMap.set(subscriptionId, callBack);

        registerLoginDevicePanel(subscriber, {
            onDataReceived: (message: any) => {
                if (message.loginDevice && message.loginDevice.subscriptionId && message.loginDevice.subscriptionId === subscriptionId) {
                    this.sendUpdates(subscriptionId, message.loginDevice.dealingData);
                }

            }
        }, subscriptionId, startTime, endTime);

        return subscriptionId;
    }
    
    async unsubscribe(subscriptionId: string) {

        if (!this.subscriptionIdCallBackMap.has(subscriptionId)) return;
        this.subscriptionIdCallBackMap.delete(subscriptionId);

        const subscriber = this.getSubscriber();
        if (subscriber) deregisterLoginDevicePanel(subscriber, subscriptionId);
    }

    private sendUpdates(subscriptionId: string, message: any) {

        const subscriber = this.getSubscriber();
        if (!subscriber || !subscriber.uniqueKeys) return;

        const callBack = this.subscriptionIdCallBackMap.get(subscriptionId);
        if (callBack) {
            const activeCols = this.activeColumns;
            if (message.insert?.length) {
                callBack.onDataRecieve(message.insert);
            } else {
                callBack.onDataRecieve(message,true);
            }
        }
    }
    private getSubscriber(): LoginPanelSubscriber {

        const subscriber: LoginPanelSubscriber = {
            id: 'login-device-panel',
            listenEvent: 'LOGIN_DEVICE_LOG',
            subscribeEvent: 'FETCH_LOGIN_DEVICE_LOG',
            unsubscribeEvent: 'FETCH_LOGIN_DEVICE_LOG',
            isLive: false,
            uniqueKeys: ["id"],
        }
        return subscriber;
    }
}
let dataServiceInstance: (LoginPanelServices | null) = null;
export interface IOnDataRecieve {
    onDataRecieve: (message: any, allowMultipleInsert?: boolean) => void;
    onDataUpdate: (message: any) => void;
}
const LoginPanelServicesInstance = () => {
    if (dataServiceInstance === null) dataServiceInstance = new LoginPanelServices();
    return dataServiceInstance;
}
export default LoginPanelServicesInstance;
