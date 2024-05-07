import {Remote} from 'comlink';
import { v4 as uuidv4 } from 'uuid';
import { WidgetConfigsType } from '../../ui/components/custom-widget/WidgetConfig';
import { DataType, HeaderColsWidthType } from './DataWorker';
import { DataSourceSubscriber, fetchInsertData } from '../../redux/action-handlers/app/AppActions';
import { dataSources } from '../../redux/reducers/canvas/CanvasReducer';
import { DataColumnPropertyMap } from '../../ui/canvas/services/WidgetService';

type WorkerType = typeof import('./DataWorker');
class DataTransformService {
    private workers:Map<string,Remote<WorkerType>>;
    private dataSourceConsumers:Map<string,Set<string>>;
    private dataSourceTimer:Map<string,NodeJS.Timer>;
    private subscriberMap:Map<string,DataSourceSubscriber>;
    constructor() {
      this.workers = new Map<string,Remote<WorkerType>>();
      this.dataSourceConsumers = new Map<string,Set<string>>;
      this.subscriberMap = this.getSubscriberMap();
      this.dataSourceTimer = new Map<string,NodeJS.Timer>;
    }
    register(dataSourceId:string) {
      const id = uuidv4();
      const newWorker = new ComlinkWorker<typeof import("./DataWorker")>(
        new URL('./DataWorker',import.meta.url)
      );
      const dataSourceConsumer = this.dataSourceConsumers.get(dataSourceId);
      if(!dataSourceConsumer) {
        this.dataSourceConsumers.set(dataSourceId,new Set([id]));
        if(!dataSourceId.startsWith('dealing-panel')) this.setUpTimer(dataSourceId);
      }else {
        dataSourceConsumer.add(id);
      }
      this.workers.set(id,newWorker);
      return id;
    }
    unregister(id:string,) {
      const worker = this.workers.get(id);
      if(!worker) return;
      worker.terminate();
      this.workers.delete(id);
      this.dataSourceConsumers.forEach((subscribers,ds)=>{
        if(subscribers.has(id)) {
          subscribers.delete(id);
          if(subscribers.size === 0) {
            this.dataSourceConsumers.delete(ds);
            this.removeTimer(ds);
            return;
          }
        }
      });  
    }

    transformData(id:string,configs:WidgetConfigsType,data:any[]):Promise<any[]> {
      return new Promise((res,rej) => {
        const worker = this.workers.get(id);
        if(!worker) return;
        worker.transformData(configs,data).then(data => {
          res(data);
        });
      })
    }
    computeSplitHeaderCols(id:string,row:DataType) {
      return new Promise<HeaderColsWidthType>((res,rej)=>{
        const worker = this.workers.get(id);
        if(!worker) return;
        worker.computeSplitHeaderCols(row).then(headerCols => {
          res(headerCols);
        })
      })
    }
    getRowData(id:string,transformedData:any[],colDefMap:DataColumnPropertyMap,headerCols:string[]) {
      return new Promise<any[][]>((res,rej) => {
        const worker = this.workers.get(id);
        if(!worker) return;
        worker.getRowData(transformedData,colDefMap,headerCols).then(rowData => {
          res(rowData);
        })
      })
    }
    private removeTimer(dataSourceId:string) {
      const timer = this.dataSourceTimer.get(dataSourceId);
      if(timer!==undefined) {
        clearInterval(timer);
        this.dataSourceTimer.delete(dataSourceId);
      }
    }
    private setUpTimer(dataSourceId:string) {
      const subscriber = this.subscriberMap.get(dataSourceId);
      if(!subscriber) return;
      const timer = setInterval(() => {
        fetchInsertData(subscriber);
      },import.meta.env.VITE_APP_SPREAD_SHEET_REFRESH_RATE);
      this.dataSourceTimer.set(dataSourceId,timer);
    }
    private getSubscriberMap() {
      const mp = new Map<string,DataSourceSubscriber>();
      dataSources.forEach(ds => {
        mp.set(ds.id,{
          id:ds.id,
          isLive:ds.isLive,
          listenEvent:ds.listenEvent,
          subscribeEvent:ds.subscribeEvent,
          unsubscribeEvent:ds.unsubscribeEvent,
          uniqueKeys:ds.uniqueKey
        })
      })
      //debugger
      return mp;
    }
}

export type DataTransformServiceType = DataTransformService;

let dataTransformServiceInstance: DataTransformService | null = null;
const DataTransformServiceFactory = {
  getInstance(): DataTransformServiceType {
    if (dataTransformServiceInstance === null)
      dataTransformServiceInstance = new DataTransformService();
    return dataTransformServiceInstance;
  }
};

export default DataTransformServiceFactory;