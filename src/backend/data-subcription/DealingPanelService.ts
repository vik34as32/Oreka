import { v4 as uuidv4 } from 'uuid';
import { DataSourceSubscriber, deregisterDealingPanel, registerDealingPanel, setActiveColumnsForDataSource, updateDealingPanelSubscription } from '../../redux/action-handlers/app/AppActions';
import { dataSources } from '../../redux/reducers/canvas/CanvasReducer';

class DealingPanelService {
    private subscriptionIdCallBackMap: Map<string, IOnDataRecieve>;
    private activeColumns: Set<string>;
    constructor() {
        this.subscriptionIdCallBackMap = new Map<string, IOnDataRecieve>();

        const dataSource = dataSources.find(ds => ds.id === "dealing-panel");
          //debugger
        if (dataSource) {
            let columns = new Set<string>();
            dataSource.columns.forEach((col) => {
                if ("field" in col) {
                    columns.add(col.field)
                }
            })
            this.activeColumns = columns;
        } else {
            this.activeColumns = new Set<string>(["id", "time", "login", "symbol", "volume", "buysell", "price", "reason", "dealingtype"]);
        }

    }

    getNewSubscriptionId() {
        return uuidv4();
    }

    subscribe(subscriptionId: string, callBack: IOnDataRecieve, startTime?: number, endTime?: number): string | null {   // subscribe to dataSource

        const subscriber = this.getSubscriber();
        
        this.subscriptionIdCallBackMap.set(subscriptionId, callBack);

        registerDealingPanel(subscriber, {
            onDataReceived: (message: any) => {
                debugger
                if (message.dealingdatainterval && message.dealingdatainterval.subscriptionId && message.dealingdatainterval.subscriptionId === subscriptionId) {
                    this.sendUpdates(subscriptionId, message.dealingdatainterval.dealingData);
                }

            }
        }, subscriptionId, startTime, endTime);

        return subscriptionId;
    }
    
    async unsubscribe(subscriptionId: string) {

        if (!this.subscriptionIdCallBackMap.has(subscriptionId)) return;
        this.subscriptionIdCallBackMap.delete(subscriptionId);

        const subscriber = this.getSubscriber();
        if (subscriber) deregisterDealingPanel(subscriber, subscriptionId);
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
    private getSubscriber(): DataSourceSubscriber {

        const subscriber: DataSourceSubscriber = {
            id: 'dealing-panel',
            listenEvent: 'DEALING_DATA_INTERVAL',
            subscribeEvent: 'FETCH_DEALING_DATA_INTERVAL',
            unsubscribeEvent: 'FETCH_DEALING_DATA_INTERVAL',
            isLive: false,
            uniqueKeys: ["id"]
        }
        return subscriber;
    }
}
let dataServiceInstance: (DealingPanelService | null) = null;
export interface IOnDataRecieve {
    onDataRecieve: (message: any, allowMultipleInsert?: boolean) => void;
    onDataUpdate: (message: any) => void;
}
const dealingPanelServiceInstance = () => {
    if (dataServiceInstance === null) dataServiceInstance = new DealingPanelService();
    return dataServiceInstance;
}
export default dealingPanelServiceInstance;