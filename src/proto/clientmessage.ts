/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.23.4
 * source: clientmessage.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./loginrequest";
import * as dependency_2 from "./loginresponse";
import * as dependency_3 from "./SubscribeTicker";
import * as dependency_4 from "./TickData";
import * as dependency_5 from "./AlertSetting";
import * as pb_1 from "google-protobuf";
export namespace Oreka {
    export class ClientMessage extends pb_1.Message {
        #one_of_decls: number[][] = [[2], [3], [4], [5], [89]];
        constructor(data?: any[] | ({
            type?: string;
        } & (({
            loginrequest?: dependency_1.Oreka.LoginRequest;
        }) | ({
            loginresponse?: dependency_2.Oreka.LoginResponse;
        }) | ({
            subscribeticker?: dependency_3.Oreka.SubscribeTicker;
        }) | ({
            tickdata?: dependency_4.Oreka.TickData;
        }) | ({
            alertsetting?: dependency_5.Oreka.AlertSetting;
        })))) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("type" in data && data.type != undefined) {
                    this.type = data.type;
                }
                if ("loginrequest" in data && data.loginrequest != undefined) {
                    this.loginrequest = data.loginrequest;
                }
                if ("loginresponse" in data && data.loginresponse != undefined) {
                    this.loginresponse = data.loginresponse;
                }
                if ("subscribeticker" in data && data.subscribeticker != undefined) {
                    this.subscribeticker = data.subscribeticker;
                }
                if ("tickdata" in data && data.tickdata != undefined) {
                    this.tickdata = data.tickdata;
                }
                if ("alertsetting" in data && data.alertsetting != undefined) {
                    this.alertsetting = data.alertsetting;
                }
            }
        }
        get type() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get loginrequest() {
            return pb_1.Message.getWrapperField(this, dependency_1.Oreka.LoginRequest, 2) as dependency_1.Oreka.LoginRequest;
        }
        set loginrequest(value: dependency_1.Oreka.LoginRequest) {
            pb_1.Message.setOneofWrapperField(this, 2, this.#one_of_decls[0], value);
        }
        get has_loginrequest() {
            return pb_1.Message.getField(this, 2) != null;
        }
        get loginresponse() {
            return pb_1.Message.getWrapperField(this, dependency_2.Oreka.LoginResponse, 3) as dependency_2.Oreka.LoginResponse;
        }
        set loginresponse(value: dependency_2.Oreka.LoginResponse) {
            pb_1.Message.setOneofWrapperField(this, 3, this.#one_of_decls[1], value);
        }
        get has_loginresponse() {
            return pb_1.Message.getField(this, 3) != null;
        }
        get subscribeticker() {
            return pb_1.Message.getWrapperField(this, dependency_3.Oreka.SubscribeTicker, 4) as dependency_3.Oreka.SubscribeTicker;
        }
        set subscribeticker(value: dependency_3.Oreka.SubscribeTicker) {
            pb_1.Message.setOneofWrapperField(this, 4, this.#one_of_decls[2], value);
        }
        get has_subscribeticker() {
            return pb_1.Message.getField(this, 4) != null;
        }
        get tickdata() {
            return pb_1.Message.getWrapperField(this, dependency_4.Oreka.TickData, 5) as dependency_4.Oreka.TickData;
        }
        set tickdata(value: dependency_4.Oreka.TickData) {
            pb_1.Message.setOneofWrapperField(this, 5, this.#one_of_decls[3], value);
        }
        get has_tickdata() {
            return pb_1.Message.getField(this, 5) != null;
        }
        get alertsetting() {
            return pb_1.Message.getWrapperField(this, dependency_5.Oreka.AlertSetting, 89) as dependency_5.Oreka.AlertSetting;
        }
        set alertsetting(value: dependency_5.Oreka.AlertSetting) {
            pb_1.Message.setOneofWrapperField(this, 89, this.#one_of_decls[4], value);
        }
        get has_alertsetting() {
            return pb_1.Message.getField(this, 89) != null;
        }
        get _loginrequest() {
            const cases: {
                [index: number]: "none" | "loginrequest";
            } = {
                0: "none",
                2: "loginrequest"
            };
            return cases[pb_1.Message.computeOneofCase(this, [2])];
        }
        get _loginresponse() {
            const cases: {
                [index: number]: "none" | "loginresponse";
            } = {
                0: "none",
                3: "loginresponse"
            };
            return cases[pb_1.Message.computeOneofCase(this, [3])];
        }
        get _subscribeticker() {
            const cases: {
                [index: number]: "none" | "subscribeticker";
            } = {
                0: "none",
                4: "subscribeticker"
            };
            return cases[pb_1.Message.computeOneofCase(this, [4])];
        }
        get _tickdata() {
            const cases: {
                [index: number]: "none" | "tickdata";
            } = {
                0: "none",
                5: "tickdata"
            };
            return cases[pb_1.Message.computeOneofCase(this, [5])];
        }
        get _alertsetting() {
            const cases: {
                [index: number]: "none" | "alertsetting";
            } = {
                0: "none",
                89: "alertsetting"
            };
            return cases[pb_1.Message.computeOneofCase(this, [89])];
        }
        static fromObject(data: {
            type?: string;
            loginrequest?: ReturnType<typeof dependency_1.Oreka.LoginRequest.prototype.toObject>;
            loginresponse?: ReturnType<typeof dependency_2.Oreka.LoginResponse.prototype.toObject>;
            subscribeticker?: ReturnType<typeof dependency_3.Oreka.SubscribeTicker.prototype.toObject>;
            tickdata?: ReturnType<typeof dependency_4.Oreka.TickData.prototype.toObject>;
            alertsetting?: ReturnType<typeof dependency_5.Oreka.AlertSetting.prototype.toObject>;
        }): ClientMessage {
            const message = new ClientMessage({});
            if (data.type != null) {
                message.type = data.type;
            }
            if (data.loginrequest != null) {
                message.loginrequest = dependency_1.Oreka.LoginRequest.fromObject(data.loginrequest);
            }
            if (data.loginresponse != null) {
                message.loginresponse = dependency_2.Oreka.LoginResponse.fromObject(data.loginresponse);
            }
            if (data.subscribeticker != null) {
                message.subscribeticker = dependency_3.Oreka.SubscribeTicker.fromObject(data.subscribeticker);
            }
            if (data.tickdata != null) {
                message.tickdata = dependency_4.Oreka.TickData.fromObject(data.tickdata);
            }
            if (data.alertsetting != null) {
                message.alertsetting = dependency_5.Oreka.AlertSetting.fromObject(data.alertsetting);
            }
            return message;
        }
        toObject() {
            const data: {
                type?: string;
                loginrequest?: ReturnType<typeof dependency_1.Oreka.LoginRequest.prototype.toObject>;
                loginresponse?: ReturnType<typeof dependency_2.Oreka.LoginResponse.prototype.toObject>;
                subscribeticker?: ReturnType<typeof dependency_3.Oreka.SubscribeTicker.prototype.toObject>;
                tickdata?: ReturnType<typeof dependency_4.Oreka.TickData.prototype.toObject>;
                alertsetting?: ReturnType<typeof dependency_5.Oreka.AlertSetting.prototype.toObject>;
            } = {};
            if (this.type != null) {
                data.type = this.type;
            }
            if (this.loginrequest != null) {
                data.loginrequest = this.loginrequest.toObject();
            }
            if (this.loginresponse != null) {
                data.loginresponse = this.loginresponse.toObject();
            }
            if (this.subscribeticker != null) {
                data.subscribeticker = this.subscribeticker.toObject();
            }
            if (this.tickdata != null) {
                data.tickdata = this.tickdata.toObject();
            }
            if (this.alertsetting != null) {
                data.alertsetting = this.alertsetting.toObject();
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type.length)
                writer.writeString(1, this.type);
            if (this.has_loginrequest)
                writer.writeMessage(2, this.loginrequest, () => this.loginrequest.serialize(writer));
            if (this.has_loginresponse)
                writer.writeMessage(3, this.loginresponse, () => this.loginresponse.serialize(writer));
            if (this.has_subscribeticker)
                writer.writeMessage(4, this.subscribeticker, () => this.subscribeticker.serialize(writer));
            if (this.has_tickdata)
                writer.writeMessage(5, this.tickdata, () => this.tickdata.serialize(writer));
            if (this.has_alertsetting)
                writer.writeMessage(89, this.alertsetting, () => this.alertsetting.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ClientMessage {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new ClientMessage();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
                        break;
                    case 2:
                        reader.readMessage(message.loginrequest, () => message.loginrequest = dependency_1.Oreka.LoginRequest.deserialize(reader));
                        break;
                    case 3:
                        reader.readMessage(message.loginresponse, () => message.loginresponse = dependency_2.Oreka.LoginResponse.deserialize(reader));
                        break;
                    case 4:
                        reader.readMessage(message.subscribeticker, () => message.subscribeticker = dependency_3.Oreka.SubscribeTicker.deserialize(reader));
                        break;
                    case 5:
                        reader.readMessage(message.tickdata, () => message.tickdata = dependency_4.Oreka.TickData.deserialize(reader));
                        break;
                    case 89:
                        reader.readMessage(message.alertsetting, () => message.alertsetting = dependency_5.Oreka.AlertSetting.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): ClientMessage {
            return ClientMessage.deserialize(bytes);
        }
    }
}
