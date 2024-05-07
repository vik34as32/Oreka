/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.23.4
 * source: TickData.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace Oreka {
    export class TickData extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            type?: string;
            insert?: TickData.Insert[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("type" in data && data.type != undefined) {
                    this.type = data.type;
                }
                if ("insert" in data && data.insert != undefined) {
                    this.insert = data.insert;
                }
            }
        }
        get type() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get insert() {
            return pb_1.Message.getRepeatedWrapperField(this, TickData.Insert, 2) as TickData.Insert[];
        }
        set insert(value: TickData.Insert[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        static fromObject(data: {
            type?: string;
            insert?: ReturnType<typeof TickData.Insert.prototype.toObject>[];
        }): TickData {
            const message = new TickData({});
            if (data.type != null) {
                message.type = data.type;
            }
            if (data.insert != null) {
                message.insert = data.insert.map(item => TickData.Insert.fromObject(item));
            }
            return message;
        }
        toObject() {
            const data: {
                type?: string;
                insert?: ReturnType<typeof TickData.Insert.prototype.toObject>[];
            } = {};
            if (this.type != null) {
                data.type = this.type;
            }
            if (this.insert != null) {
                data.insert = this.insert.map((item: TickData.Insert) => item.toObject());
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type.length)
                writer.writeString(1, this.type);
            if (this.insert.length)
                writer.writeRepeatedMessage(2, this.insert, (item: TickData.Insert) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TickData {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new TickData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
                        break;
                    case 2:
                        reader.readMessage(message.insert, () => pb_1.Message.addToRepeatedWrapperField(message, 2, TickData.Insert.deserialize(reader), TickData.Insert));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): TickData {
            return TickData.deserialize(bytes);
        }
    }
    export namespace TickData {
        export class Insert extends pb_1.Message {
            #one_of_decls: number[][] = [];
            constructor(data?: any[] | {
                symbol?: string;
                bid?: number;
                ask?: number;
                last?: number;
                ticktime?: string;
                open?: number;
                high?: number;
                low?: number;
                close?: number;
            }) {
                super();
                pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                if (!Array.isArray(data) && typeof data == "object") {
                    if ("symbol" in data && data.symbol != undefined) {
                        this.symbol = data.symbol;
                    }
                    if ("bid" in data && data.bid != undefined) {
                        this.bid = data.bid;
                    }
                    if ("ask" in data && data.ask != undefined) {
                        this.ask = data.ask;
                    }
                    if ("last" in data && data.last != undefined) {
                        this.last = data.last;
                    }
                    if ("ticktime" in data && data.ticktime != undefined) {
                        this.ticktime = data.ticktime;
                    }
                    if ("open" in data && data.open != undefined) {
                        this.open = data.open;
                    }
                    if ("high" in data && data.high != undefined) {
                        this.high = data.high;
                    }
                    if ("low" in data && data.low != undefined) {
                        this.low = data.low;
                    }
                    if ("close" in data && data.close != undefined) {
                        this.close = data.close;
                    }
                }
            }
            get symbol() {
                return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
            }
            set symbol(value: string) {
                pb_1.Message.setField(this, 1, value);
            }
            get bid() {
                return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
            }
            set bid(value: number) {
                pb_1.Message.setField(this, 2, value);
            }
            get ask() {
                return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
            }
            set ask(value: number) {
                pb_1.Message.setField(this, 3, value);
            }
            get last() {
                return pb_1.Message.getFieldWithDefault(this, 4, 0) as number;
            }
            set last(value: number) {
                pb_1.Message.setField(this, 4, value);
            }
            get ticktime() {
                return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
            }
            set ticktime(value: string) {
                pb_1.Message.setField(this, 5, value);
            }
            get open() {
                return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
            }
            set open(value: number) {
                pb_1.Message.setField(this, 6, value);
            }
            get high() {
                return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
            }
            set high(value: number) {
                pb_1.Message.setField(this, 7, value);
            }
            get low() {
                return pb_1.Message.getFieldWithDefault(this, 8, 0) as number;
            }
            set low(value: number) {
                pb_1.Message.setField(this, 8, value);
            }
            get close() {
                return pb_1.Message.getFieldWithDefault(this, 9, 0) as number;
            }
            set close(value: number) {
                pb_1.Message.setField(this, 9, value);
            }
            static fromObject(data: {
                symbol?: string;
                bid?: number;
                ask?: number;
                last?: number;
                ticktime?: string;
                open?: number;
                high?: number;
                low?: number;
                close?: number;
            }): Insert {
                const message = new Insert({});
                if (data.symbol != null) {
                    message.symbol = data.symbol;
                }
                if (data.bid != null) {
                    message.bid = data.bid;
                }
                if (data.ask != null) {
                    message.ask = data.ask;
                }
                if (data.last != null) {
                    message.last = data.last;
                }
                if (data.ticktime != null) {
                    message.ticktime = data.ticktime;
                }
                if (data.open != null) {
                    message.open = data.open;
                }
                if (data.high != null) {
                    message.high = data.high;
                }
                if (data.low != null) {
                    message.low = data.low;
                }
                if (data.close != null) {
                    message.close = data.close;
                }
                return message;
            }
            toObject() {
                const data: {
                    symbol?: string;
                    bid?: number;
                    ask?: number;
                    last?: number;
                    ticktime?: string;
                    open?: number;
                    high?: number;
                    low?: number;
                    close?: number;
                } = {};
                if (this.symbol != null) {
                    data.symbol = this.symbol;
                }
                if (this.bid != null) {
                    data.bid = this.bid;
                }
                if (this.ask != null) {
                    data.ask = this.ask;
                }
                if (this.last != null) {
                    data.last = this.last;
                }
                if (this.ticktime != null) {
                    data.ticktime = this.ticktime;
                }
                if (this.open != null) {
                    data.open = this.open;
                }
                if (this.high != null) {
                    data.high = this.high;
                }
                if (this.low != null) {
                    data.low = this.low;
                }
                if (this.close != null) {
                    data.close = this.close;
                }
                return data;
            }
            serialize(): Uint8Array;
            serialize(w: pb_1.BinaryWriter): void;
            serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
                const writer = w || new pb_1.BinaryWriter();
                if (this.symbol.length)
                    writer.writeString(1, this.symbol);
                if (this.bid != 0)
                    writer.writeDouble(2, this.bid);
                if (this.ask != 0)
                    writer.writeDouble(3, this.ask);
                if (this.last != 0)
                    writer.writeDouble(4, this.last);
                if (this.ticktime.length)
                    writer.writeString(5, this.ticktime);
                if (this.open != 0)
                    writer.writeDouble(6, this.open);
                if (this.high != 0)
                    writer.writeDouble(7, this.high);
                if (this.low != 0)
                    writer.writeDouble(8, this.low);
                if (this.close != 0)
                    writer.writeDouble(9, this.close);
                if (!w)
                    return writer.getResultBuffer();
            }
            static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Insert {
                const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Insert();
                while (reader.nextField()) {
                    if (reader.isEndGroup())
                        break;
                    switch (reader.getFieldNumber()) {
                        case 1:
                            message.symbol = reader.readString();
                            break;
                        case 2:
                            message.bid = reader.readDouble();
                            break;
                        case 3:
                            message.ask = reader.readDouble();
                            break;
                        case 4:
                            message.last = reader.readDouble();
                            break;
                        case 5:
                            message.ticktime = reader.readString();
                            break;
                        case 6:
                            message.open = reader.readDouble();
                            break;
                        case 7:
                            message.high = reader.readDouble();
                            break;
                        case 8:
                            message.low = reader.readDouble();
                            break;
                        case 9:
                            message.close = reader.readDouble();
                            break;
                        default: reader.skipField();
                    }
                }
                return message;
            }
            serializeBinary(): Uint8Array {
                return this.serialize();
            }
            static deserializeBinary(bytes: Uint8Array): Insert {
                return Insert.deserialize(bytes);
            }
        }
    }
}
