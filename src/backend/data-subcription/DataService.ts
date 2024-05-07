import { v4 as uuidv4 } from 'uuid';
import { DataSourceSubscriber, deregisterDataStream, fetchInsertData, registerDataStream, setActiveColumnsForDataSource } from '../../redux/action-handlers/app/AppActions';
import { dataSources } from '../../redux/reducers/canvas/CanvasReducer';

class DataService {
    private subscriptionIdCallBackMap:Map<string,IOnDataRecieve>;
    private dataSourceSubscriptionsMap:Map<string,Set<string>>;
    private subscriptionColumnsMap:Map<string,Set<string>>;
    private dataSourceActiveColumnsMap:Map<string,Set<string>>;
    private dataSourceMap:Map<string,DataSourceSubscriber>;
    constructor() {
        this.subscriptionIdCallBackMap = new Map<string,IOnDataRecieve>();
        this.dataSourceSubscriptionsMap = new Map<string,Set<string>>();
        this.subscriptionColumnsMap = new Map<string,Set<string>>();
        this.dataSourceActiveColumnsMap = new Map<string,Set<string>>();
        this.dataSourceMap = new Map<string,DataSourceSubscriber>();
    }
    subscribe(dataSourceId:string,columns:string[],callBack:IOnDataRecieve):string | null {   // subscribe to dataSource
        // generate subscription id
        // register callback in front of subcription id in subscriptionIdCallBackMap
        // add subscription id in datasourceSubscriptionMap
        // if datastream not subscribed then subscribe it and register callback 
        // set new columns in subscriptionColumnMap
        // fetch and update active columns
        const subscriber = this.getSubscriber(dataSourceId);
        if(!subscriber) return null;

        const subscriptionId = uuidv4();
        
        this.subscriptionIdCallBackMap.set(subscriptionId,callBack);
        this.subscriptionColumnsMap.set(subscriptionId,new Set(columns));
        this.updateActiveColumns(dataSourceId,subscriptionId);
        if(!this.dataSourceSubscriptionsMap.has(dataSourceId)) {
            this.dataSourceSubscriptionsMap.set(dataSourceId,new Set());
            registerDataStream(subscriber,{
                onDataReceived:(message:any) => {
                    this.sendUpdates(dataSourceId,message);
                }
            })
        }
        else fetchInsertData(subscriber);
        this.dataSourceSubscriptionsMap.get(dataSourceId).add(subscriptionId);
        // get insert data again
        return subscriptionId;
    }
    updateSubscription(dataSourceId:string,subscriptionId:string,newColumns:string[]) {
        // set new columns in subscriptionColumnsMap
        // fetch new active columns and then update the active columns
        const subscriber = this.getSubscriber(dataSourceId);
        if(!this.subscriptionIdCallBackMap.has(subscriptionId) || !subscriber) return;
        
        this.subscriptionColumnsMap.set(subscriptionId,new Set(newColumns));
        this.updateActiveColumns(dataSourceId,subscriptionId);
        fetchInsertData(subscriber);
        /**
         *this.subscriptionIdCallBackMap = new Map<string,IOnDataRecieve>();
        this.dataSourceSubscriptionsMap = new Map<string,Set<string>>();
        this.subscriptionColumnsMap = new Map<string,Set<string>>();
        this.dataSourceActiveColumnsMap = new Map<string,Set<string>>();
        this.dataSourceMap = new Map<string,DataSourceSubscriber>();
         */
    }
    async unsubscribe(dataSourceId:string,subscriptionId:string) {
        // remove callback from subscriptionIdCallBackMap
        // remove subscriptionId from dataSourceSubscriptionsMap
        // remove subscriptionId from subscriptionColumnsMap
        // if all subscriptions for a datasource is removed then remove datasource subscription as well
        // fetch and update the active columns
        if(!this.subscriptionIdCallBackMap.has(subscriptionId)) return;
        this.subscriptionColumnsMap.delete(subscriptionId);
        this.subscriptionIdCallBackMap.delete(subscriptionId);
        this.dataSourceSubscriptionsMap.get(dataSourceId)?.delete(subscriptionId);
        this.recomputeActiveCols(dataSourceId);
        if(this.dataSourceSubscriptionsMap.get(dataSourceId)?.size === 0) {
            const subscriber = this.getSubscriber(dataSourceId);
            if(subscriber) deregisterDataStream(subscriber);
            this.dataSourceSubscriptionsMap.delete(dataSourceId);
        }
    }
    private recomputeActiveCols(dataSourceId:string) {
        const activeCols = new Set<string>();
        this.dataSourceSubscriptionsMap.get(dataSourceId)?.forEach(subscription => {
            this.subscriptionColumnsMap.get(subscription)?.forEach(col => activeCols.add(col));
        })
        const subscriber = this.getSubscriber(dataSourceId);
        if(subscriber) {
            if(activeCols.size === 0) {
                this.dataSourceActiveColumnsMap.delete(dataSourceId);
                return;
            }
            subscriber.uniqueKeys?.forEach(key => activeCols.add(key));
            this.dataSourceActiveColumnsMap.set(dataSourceId,activeCols);
            setActiveColumnsForDataSource(subscriber,Array.from(activeCols));
        }
    }
    private updateActiveColumns(dataSourceId:string,subscriptionId:string) {
        const activeColsForSubscription = this.subscriptionColumnsMap.get(subscriptionId);
        if(activeColsForSubscription && activeColsForSubscription.size) {
            let currentActiveCols = this.dataSourceActiveColumnsMap.get(dataSourceId);
            const subscriber = this.getSubscriber(dataSourceId);
            if(!currentActiveCols) {
                if(subscriber && subscriber.uniqueKeys) {
                    this.dataSourceActiveColumnsMap.set(dataSourceId,new Set(subscriber.uniqueKeys));
                    currentActiveCols = this.dataSourceActiveColumnsMap.get(dataSourceId);
                } else return;
            }
            activeColsForSubscription.forEach(col => currentActiveCols.add(col));
            if(subscriber)
                setActiveColumnsForDataSource(subscriber,Array.from(currentActiveCols));
        }
    }
    private sendUpdates(dataSourceId:string,message:any) {
        // send updates to all subscribers
        // send only updates for the subscribed columns
        const subscriber = this.getSubscriber(dataSourceId);
        if(!subscriber || !subscriber.uniqueKeys) return;

        this.dataSourceSubscriptionsMap.get(dataSourceId)?.forEach(subscription => {
            const callBack = this.subscriptionIdCallBackMap.get(subscription);
            if(callBack) {
                const activeCols = this.subscriptionColumnsMap.get(subscription);
                if(message.update?.length) {
                    const finalData:any[] = [];
                    message.update.forEach((val:any) => {
                        const data:{[id:string]:any} = {};
                        activeCols?.forEach((col:string) => {
                            data[col] = val[col];
                        })
                        subscriber.uniqueKeys?.forEach((col:string) => {
                            data[col] = val[col];
                        })
                        finalData.push(data);
                    })
                    callBack.onDataUpdate(message.update);
                }
                else if(message.insert?.length) {
                    const finalData:any[] = [];
                    message.insert.forEach((val:any) => {
                        const data:{[id:string]:any} = {};
                        activeCols?.forEach((col:string) => {
                            data[col] = val[col];
                        })
                        subscriber.uniqueKeys?.forEach((col:string) => {
                            data[col] = val[col];
                        })
                        finalData.push(data);
                    })
                    callBack.onDataRecieve(message.insert);
                }
                else if(message.brokers?.length) {
                    callBack.onDataRecieve(message.brokers);    
                }
                else if(message.subbrokers?.length) {
                    callBack.onDataRecieve(message.subbrokers);
                }
                else if(message.clients?.length)
                    callBack.onDataRecieve(message.clients);
                else {
                    callBack.onDataRecieve([message],true);
                }
            }
        })
    }
    private getSubscriber(dataSourceId:string):DataSourceSubscriber | undefined {
        let subscriber = this.dataSourceMap.get(dataSourceId);
        if(!subscriber) {
            const dataSource = dataSources.find(ds => ds.id === dataSourceId);
            if(dataSource) {
                subscriber = {
                    id:dataSource.id,
                    listenEvent:dataSource.listenEvent,
                    subscribeEvent:dataSource.subscribeEvent,
                    unsubscribeEvent:dataSource.unsubscribeEvent,
                    isLive:dataSource.isLive,
                    uniqueKeys:dataSource.uniqueKey
                }
            }
            if(subscriber) this.dataSourceMap.set(dataSourceId,subscriber);
        }
        //debugger
        return this.dataSourceMap.get(dataSourceId);
    }
}
let dataServiceInstance:(DataService | null) = null;
export interface IOnDataRecieve {
    onDataRecieve: (message: any,allowMultipleInsert?:boolean) => void;
    onDataUpdate: (message: any) => void;
}
const getDataServiceInstance = () => {
    if(dataServiceInstance === null) dataServiceInstance = new DataService();
    return dataServiceInstance;
}
export default getDataServiceInstance;