/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.23.4
 * source: DealingDataInterval.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace Oreka {
    export class DealingDataInterval extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            type?: string;
            subscriptionId?: string;
            dealingData?: DealingDataInterval.Dealingdata[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [3], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("type" in data && data.type != undefined) {
                    this.type = data.type;
                }
                if ("subscriptionId" in data && data.subscriptionId != undefined) {
                    this.subscriptionId = data.subscriptionId;
                }
                if ("dealingData" in data && data.dealingData != undefined) {
                    this.dealingData = data.dealingData;
                }
            }
        }
        get type() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get subscriptionId() {
            return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
        }
        set subscriptionId(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get dealingData() {
            return pb_1.Message.getRepeatedWrapperField(this, DealingDataInterval.Dealingdata, 3) as DealingDataInterval.Dealingdata[];
        }
        set dealingData(value: DealingDataInterval.Dealingdata[]) {
            pb_1.Message.setRepeatedWrapperField(this, 3, value);
        }
        static fromObject(data: {
            type?: string;
            subscriptionId?: string;
            dealingData?: ReturnType<typeof DealingDataInterval.Dealingdata.prototype.toObject>[];
        }): DealingDataInterval {
            const message = new DealingDataInterval({});
            if (data.type != null) {
                message.type = data.type;
            }
            if (data.subscriptionId != null) {
                message.subscriptionId = data.subscriptionId;
            }
            if (data.dealingData != null) {
                message.dealingData = data.dealingData.map(item => DealingDataInterval.Dealingdata.fromObject(item));
            }
            return message;
        }
        toObject() {
            const data: {
                type?: string;
                subscriptionId?: string;
                dealingData?: ReturnType<typeof DealingDataInterval.Dealingdata.prototype.toObject>[];
            } = {};
            if (this.type != null) {
                data.type = this.type;
            }
            if (this.subscriptionId != null) {
                data.subscriptionId = this.subscriptionId;
            }
            if (this.dealingData != null) {
                data.dealingData = this.dealingData.map((item: DealingDataInterval.Dealingdata) => item.toObject());
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type.length)
                writer.writeString(1, this.type);
            if (this.subscriptionId.length)
                writer.writeString(2, this.subscriptionId);
            if (this.dealingData.length)
                writer.writeRepeatedMessage(3, this.dealingData, (item: DealingDataInterval.Dealingdata) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DealingDataInterval {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new DealingDataInterval();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
                        break;
                    case 2:
                        message.subscriptionId = reader.readString();
                        break;
                    case 3:
                        reader.readMessage(message.dealingData, () => pb_1.Message.addToRepeatedWrapperField(message, 3, DealingDataInterval.Dealingdata.deserialize(reader), DealingDataInterval.Dealingdata));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): DealingDataInterval {
            return DealingDataInterval.deserialize(bytes);
        }
    }
    export namespace DealingDataInterval {
        export class Dealingdata extends pb_1.Message {
            #one_of_decls: number[][] = [];
            constructor(data?: any[] | {
                type?: string;
                id?: number;
                time?: number;
                login?: string;
                symbol?: string;
                buysell?: string;
                volume?: number;
                price?: number;
                reason?: string;
                dealingtype?: string;
                subscriptionId?: string;
            }) {
                super();
                pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                if (!Array.isArray(data) && typeof data == "object") {
                    if ("type" in data && data.type != undefined) {
                        this.type = data.type;
                    }
                    if ("id" in data && data.id != undefined) {
                        this.id = data.id;
                    }
                    if ("time" in data && data.time != undefined) {
                        this.time = data.time;
                    }
                    if ("login" in data && data.login != undefined) {
                        this.login = data.login;
                    }
                    if ("symbol" in data && data.symbol != undefined) {
                        this.symbol = data.symbol;
                    }
                    if ("buysell" in data && data.buysell != undefined) {
                        this.buysell = data.buysell;
                    }
                    if ("volume" in data && data.volume != undefined) {
                        this.volume = data.volume;
                    }
                    if ("price" in data && data.price != undefined) {
                        this.price = data.price;
                    }
                    if ("reason" in data && data.reason != undefined) {
                        this.reason = data.reason;
                    }
                    if ("dealingtype" in data && data.dealingtype != undefined) {
                        this.dealingtype = data.dealingtype;
                    }
                    if ("subscriptionId" in data && data.subscriptionId != undefined) {
                        this.subscriptionId = data.subscriptionId;
                    }
                }
            }
            get type() {
                return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
            }
            set type(value: string) {
                pb_1.Message.setField(this, 1, value);
            }
            get id() {
                return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
            }
            set id(value: number) {
                pb_1.Message.setField(this, 2, value);
            }
            get time() {
                return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
            }
            set time(value: number) {
                pb_1.Message.setField(this, 3, value);
            }
            get login() {
                return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
            }
            set login(value: string) {
                pb_1.Message.setField(this, 4, value);
            }
            get symbol() {
                return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
            }
            set symbol(value: string) {
                pb_1.Message.setField(this, 5, value);
            }
            get buysell() {
                return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
            }
            set buysell(value: string) {
                pb_1.Message.setField(this, 6, value);
            }
            get volume() {
                return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
            }
            set volume(value: number) {
                pb_1.Message.setField(this, 7, value);
            }
            get price() {
                return pb_1.Message.getFieldWithDefault(this, 8, 0) as number;
            }
            set price(value: number) {
                pb_1.Message.setField(this, 8, value);
            }
            get reason() {
                return pb_1.Message.getFieldWithDefault(this, 9, "") as string;
            }
            set reason(value: string) {
                pb_1.Message.setField(this, 9, value);
            }
            get dealingtype() {
                return pb_1.Message.getFieldWithDefault(this, 10, "") as string;
            }
            set dealingtype(value: string) {
                pb_1.Message.setField(this, 10, value);
            }
            get subscriptionId() {
                return pb_1.Message.getFieldWithDefault(this, 11, "") as string;
            }
            set subscriptionId(value: string) {
                pb_1.Message.setField(this, 11, value);
            }
            static fromObject(data: {
                type?: string;
                id?: number;
                time?: number;
                login?: string;
                symbol?: string;
                buysell?: string;
                volume?: number;
                price?: number;
                reason?: string;
                dealingtype?: string;
                subscriptionId?: string;
            }): Dealingdata {
                const message = new Dealingdata({});
                if (data.type != null) {
                    message.type = data.type;
                }
                if (data.id != null) {
                    message.id = data.id;
                }
                if (data.time != null) {
                    message.time = data.time;
                }
                if (data.login != null) {
                    message.login = data.login;
                }
                if (data.symbol != null) {
                    message.symbol = data.symbol;
                }
                if (data.buysell != null) {
                    message.buysell = data.buysell;
                }
                if (data.volume != null) {
                    message.volume = data.volume;
                }
                if (data.price != null) {
                    message.price = data.price;
                }
                if (data.reason != null) {
                    message.reason = data.reason;
                }
                if (data.dealingtype != null) {
                    message.dealingtype = data.dealingtype;
                }
                if (data.subscriptionId != null) {
                    message.subscriptionId = data.subscriptionId;
                }
                return message;
            }
            toObject() {
                const data: {
                    type?: string;
                    id?: number;
                    time?: number;
                    login?: string;
                    symbol?: string;
                    buysell?: string;
                    volume?: number;
                    price?: number;
                    reason?: string;
                    dealingtype?: string;
                    subscriptionId?: string;
                } = {};
                if (this.type != null) {
                    data.type = this.type;
                }
                if (this.id != null) {
                    data.id = this.id;
                }
                if (this.time != null) {
                    data.time = this.time;
                }
                if (this.login != null) {
                    data.login = this.login;
                }
                if (this.symbol != null) {
                    data.symbol = this.symbol;
                }
                if (this.buysell != null) {
                    data.buysell = this.buysell;
                }
                if (this.volume != null) {
                    data.volume = this.volume;
                }
                if (this.price != null) {
                    data.price = this.price;
                }
                if (this.reason != null) {
                    data.reason = this.reason;
                }
                if (this.dealingtype != null) {
                    data.dealingtype = this.dealingtype;
                }
                if (this.subscriptionId != null) {
                    data.subscriptionId = this.subscriptionId;
                }
                return data;
            }
            serialize(): Uint8Array;
            serialize(w: pb_1.BinaryWriter): void;
            serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
                const writer = w || new pb_1.BinaryWriter();
                if (this.type.length)
                    writer.writeString(1, this.type);
                if (this.id != 0)
                    writer.writeUint32(2, this.id);
                if (this.time != 0)
                    writer.writeUint32(3, this.time);
                if (this.login.length)
                    writer.writeString(4, this.login);
                if (this.symbol.length)
                    writer.writeString(5, this.symbol);
                if (this.buysell.length)
                    writer.writeString(6, this.buysell);
                if (this.volume != 0)
                    writer.writeDouble(7, this.volume);
                if (this.price != 0)
                    writer.writeDouble(8, this.price);
                if (this.reason.length)
                    writer.writeString(9, this.reason);
                if (this.dealingtype.length)
                    writer.writeString(10, this.dealingtype);
                if (this.subscriptionId.length)
                    writer.writeString(11, this.subscriptionId);
                if (!w)
                    return writer.getResultBuffer();
            }
            static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Dealingdata {
                const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Dealingdata();
                while (reader.nextField()) {
                    if (reader.isEndGroup())
                        break;
                    switch (reader.getFieldNumber()) {
                        case 1:
                            message.type = reader.readString();
                            break;
                        case 2:
                            message.id = reader.readUint32();
                            break;
                        case 3:
                            message.time = reader.readUint32();
                            break;
                        case 4:
                            message.login = reader.readString();
                            break;
                        case 5:
                            message.symbol = reader.readString();
                            break;
                        case 6:
                            message.buysell = reader.readString();
                            break;
                        case 7:
                            message.volume = reader.readDouble();
                            break;
                        case 8:
                            message.price = reader.readDouble();
                            break;
                        case 9:
                            message.reason = reader.readString();
                            break;
                        case 10:
                            message.dealingtype = reader.readString();
                            break;
                        case 11:
                            message.subscriptionId = reader.readString();
                            break;
                        default: reader.skipField();
                    }
                }
                return message;
            }
            serializeBinary(): Uint8Array {
                return this.serialize();
            }
            static deserializeBinary(bytes: Uint8Array): Dealingdata {
                return Dealingdata.deserialize(bytes);
            }
        }
    }
}
