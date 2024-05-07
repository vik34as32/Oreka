/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.23.4
 * source: LoginDeviceLog.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace Oreka {
    export class LoginDeviceLog extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            type?: string;
            logdata?: LoginDeviceLog.LogData[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("type" in data && data.type != undefined) {
                    this.type = data.type;
                }
                if ("logdata" in data && data.logdata != undefined) {
                    this.logdata = data.logdata;
                }
            }
        }
        get type() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get logdata() {
            return pb_1.Message.getRepeatedWrapperField(this, LoginDeviceLog.LogData, 2) as LoginDeviceLog.LogData[];
        }
        set logdata(value: LoginDeviceLog.LogData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        static fromObject(data: {
            type?: string;
            logdata?: ReturnType<typeof LoginDeviceLog.LogData.prototype.toObject>[];
        }): LoginDeviceLog {
            const message = new LoginDeviceLog({});
            if (data.type != null) {
                message.type = data.type;
            }
            if (data.logdata != null) {
                message.logdata = data.logdata.map(item => LoginDeviceLog.LogData.fromObject(item));
            }
            return message;
        }
        toObject() {
            const data: {
                type?: string;
                logdata?: ReturnType<typeof LoginDeviceLog.LogData.prototype.toObject>[];
            } = {};
            if (this.type != null) {
                data.type = this.type;
            }
            if (this.logdata != null) {
                data.logdata = this.logdata.map((item: LoginDeviceLog.LogData) => item.toObject());
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type.length)
                writer.writeString(1, this.type);
            if (this.logdata.length)
                writer.writeRepeatedMessage(2, this.logdata, (item: LoginDeviceLog.LogData) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): LoginDeviceLog {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new LoginDeviceLog();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
                        break;
                    case 2:
                        reader.readMessage(message.logdata, () => pb_1.Message.addToRepeatedWrapperField(message, 2, LoginDeviceLog.LogData.deserialize(reader), LoginDeviceLog.LogData));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): LoginDeviceLog {
            return LoginDeviceLog.deserialize(bytes);
        }
    }
    export namespace LoginDeviceLog {
        export class LogData extends pb_1.Message {
            #one_of_decls: number[][] = [];
            constructor(data?: any[] | {
                time?: number;
                ip?: string;
                login?: string;
                deviceid?: string;
            }) {
                super();
                pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                if (!Array.isArray(data) && typeof data == "object") {
                    if ("time" in data && data.time != undefined) {
                        this.time = data.time;
                    }
                    if ("ip" in data && data.ip != undefined) {
                        this.ip = data.ip;
                    }
                    if ("login" in data && data.login != undefined) {
                        this.login = data.login;
                    }
                    if ("deviceid" in data && data.deviceid != undefined) {
                        this.deviceid = data.deviceid;
                    }
                }
            }
            get time() {
                return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
            }
            set time(value: number) {
                pb_1.Message.setField(this, 1, value);
            }
            get ip() {
                return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
            }
            set ip(value: string) {
                pb_1.Message.setField(this, 2, value);
            }
            get login() {
                return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
            }
            set login(value: string) {
                pb_1.Message.setField(this, 3, value);
            }
            get deviceid() {
                return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
            }
            set deviceid(value: string) {
                pb_1.Message.setField(this, 4, value);
            }
            static fromObject(data: {
                time?: number;
                ip?: string;
                login?: string;
                deviceid?: string;
            }): LogData {
                const message = new LogData({});
                if (data.time != null) {
                    message.time = data.time;
                }
                if (data.ip != null) {
                    message.ip = data.ip;
                }
                if (data.login != null) {
                    message.login = data.login;
                }
                if (data.deviceid != null) {
                    message.deviceid = data.deviceid;
                }
                return message;
            }
            toObject() {
                const data: {
                    time?: number;
                    ip?: string;
                    login?: string;
                    deviceid?: string;
                } = {};
                if (this.time != null) {
                    data.time = this.time;
                }
                if (this.ip != null) {
                    data.ip = this.ip;
                }
                if (this.login != null) {
                    data.login = this.login;
                }
                if (this.deviceid != null) {
                    data.deviceid = this.deviceid;
                }
                return data;
            }
            serialize(): Uint8Array;
            serialize(w: pb_1.BinaryWriter): void;
            serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
                const writer = w || new pb_1.BinaryWriter();
                if (this.time != 0)
                    writer.writeUint32(1, this.time);
                if (this.ip.length)
                    writer.writeString(2, this.ip);
                if (this.login.length)
                    writer.writeString(3, this.login);
                if (this.deviceid.length)
                    writer.writeString(4, this.deviceid);
                if (!w)
                    return writer.getResultBuffer();
            }
            static deserialize(bytes: Uint8Array | pb_1.BinaryReader): LogData {
                const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new LogData();
                while (reader.nextField()) {
                    if (reader.isEndGroup())
                        break;
                    switch (reader.getFieldNumber()) {
                        case 1:
                            message.time = reader.readUint32();
                            break;
                        case 2:
                            message.ip = reader.readString();
                            break;
                        case 3:
                            message.login = reader.readString();
                            break;
                        case 4:
                            message.deviceid = reader.readString();
                            break;
                        default: reader.skipField();
                    }
                }
                return message;
            }
            serializeBinary(): Uint8Array {
                return this.serialize();
            }
            static deserializeBinary(bytes: Uint8Array): LogData {
                return LogData.deserialize(bytes);
            }
        }
    }
}