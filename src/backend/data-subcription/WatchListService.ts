import { v4 as uuidv4 } from 'uuid';
import { deregisterDataStream, fetchInsertData, registerDataStream, sendMessage } from '../../redux/action-handlers/app/AppActions';
import { Oreka as ClientMessage } from "../../proto/clientmessage"; 
import { Oreka as SubscribeTicker } from "../../proto/SubscribeTicker";
const subscriber = {
    id:"tick-data",
    isLive:true,
    listenEvent:"TICK_DATA",
    subscribeEvent:"FETCH_TICK_DATA",
    unsubscribeEvent:"FETCH_TICK_DATA",
    uniqueKeys:["symbol"]
}
class WatchListService {
  private subscriptionCallBack: Map<string, IOnDataRecieve>;
  private subscriptionTickers: Map<string, Set<string>>;
  private activeTickers: Set<string>;
  constructor() {
    this.subscriptionCallBack = new Map<string, IOnDataRecieve>();
    this.subscriptionTickers = new Map<string, Set<string>>();
    this.activeTickers = new Set<string>();
  }
  register(callBack: IOnDataRecieve) {
    const subscriptionId = uuidv4();
    if (this.subscriptionCallBack.size === 0) {
      registerDataStream(subscriber, {
        onDataReceived: (message: any) => {
          this.sendUpdates(message);
        },
      });
    } else {
      fetchInsertData(subscriber);
    }
    this.subscriptionCallBack.set(subscriptionId, callBack);
    return subscriptionId;
  }
  deregister(subscriptionId: string) {
    this.subscriptionCallBack.delete(subscriptionId);
    this.subscriptionTickers.delete(subscriptionId);
    this.computeActiveTickers();
    if (this.subscriptionCallBack.size === 0) {
      deregisterDataStream(subscriber);
    }
  }
  subscribeToTicker(subscriptionId: string, tickers: string[]) {
    // return if not registered
    if (!this.subscriptionCallBack.has(subscriptionId)) return;

    let tickerSubscription = this.subscriptionTickers.get(subscriptionId);
    if (!tickerSubscription) {
      // if doesn't exists, add it
      const subscribedTickers = new Set<string>(tickers);
      this.subscriptionTickers.set(subscriptionId, subscribedTickers);
    } else {
      // else update it
      tickers.forEach((ticker) => {
        tickerSubscription?.add(ticker);
      });
    }

    tickers.forEach((ticker) => this.activeTickers.add(ticker));
    
    const request = SubscribeTicker.SubscribeTicker.fromObject({ type:"SUBSCRIBE_TICKER", tickers:tickers});
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.subscribeticker = request;
    const buf = clientMessage.serializeBinary();
    sendMessage(buf);
  }
  unsubscribeTicker(subscriptionId: string, tickers: string[]) {
    const subscribedTickers = this.subscriptionTickers.get(subscriptionId);

    // if subscription doesn't exist return
    if (!subscribedTickers) return;

    // remove each subscription
    tickers.forEach((ticker) => subscribedTickers.delete(ticker));
    // if all subscriptions removed then delete it
    if (subscribedTickers.size === 0)
      this.subscriptionTickers.delete(subscriptionId);

    const prevActive = Array.from(this.activeTickers);
    this.computeActiveTickers();

    const tickersToUnsubscibe = prevActive.filter(
      (ticker) => !this.activeTickers.has(ticker)
    );

    if (tickersToUnsubscibe.length > 0) {
      // unsubscribe the unused tickers
      const request = SubscribeTicker.SubscribeTicker.fromObject({ type:"UNSUBSCRIBE_TICKER", tickers:tickersToUnsubscibe});
      const clientMessage= new ClientMessage.ClientMessage();
      clientMessage.subscribeticker = request;
      const buf = clientMessage.serializeBinary();
      sendMessage(buf);
    }
  }

  private computeActiveTickers(): void {
    this.activeTickers.clear();
    this.subscriptionTickers.forEach((tickerSet, subscriptionId) => {
      tickerSet.forEach((ticker) => this.activeTickers.add(ticker));
    });
  }
  private getObjectFromArray(arr: any[], key: string) {
    return arr.reduce((prev: { [id: string]: any }, curr) => {
      prev[curr[key]] = curr;
      return prev;
    }, {});
  }
  private filterDataBasedOnSubscription(
    messageObject: { [id: string]: any },
    subscribedTickers: Set<string>
  ): any[] {
    const data: any[] = [];
    subscribedTickers.forEach((ticker) => {
      const val = messageObject[ticker];
      if (val) data.push(val);
    });
    return data;
  }
  private sendUpdates(message: any): void {
    if (message.insert) {
      const messageObject = this.getObjectFromArray(message.insert, "symbol");
      this.subscriptionCallBack.forEach((callBack, subscriptionId) => {
        // send updates
        const subscribedTickers = this.subscriptionTickers.get(subscriptionId);
        if (!subscribedTickers) return;
        const data = this.filterDataBasedOnSubscription(
          messageObject,
          subscribedTickers
        );
        if(data.length) callBack.onDataRecieve(data);
      }); 
    } else {
      const messageObject = this.getObjectFromArray(message.update, "symbol");
      this.subscriptionCallBack.forEach((callBack, subscriptionId) => {
        // send updates
        const subscribedTickers = this.subscriptionTickers.get(subscriptionId);
        if (!subscribedTickers) return;
        const data = this.filterDataBasedOnSubscription(
          messageObject,
          subscribedTickers
        );
        if(data.length) callBack.onDataUpdate(data);
      });
    }
  }
}

let watchListServiceInstance:WatchListService | null = null;

const WatchListServiceFactory = {
    getInstance():WatchListService {
        if (!watchListServiceInstance) {
            watchListServiceInstance = new WatchListService();
        }
        return watchListServiceInstance;
      }
}
export interface IOnDataRecieve {
    onDataRecieve: (message: any,allowMultipleInsert?:boolean) => void;
    onDataUpdate: (message: any) => void;
}
export default WatchListServiceFactory;