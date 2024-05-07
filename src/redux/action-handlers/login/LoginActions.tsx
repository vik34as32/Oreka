import Fingerprint2 from "fingerprintjs2";
import { Dispatch } from "redux";
import UAParser from "ua-parser-js";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import { sendMessage } from "../app/AppActions";
import { Oreka as LoginRequest } from "../../../proto/loginrequest";
import { Oreka as ClientMessage } from "../../../proto/clientmessage";

export function fetchFingerPrint(dispatcher: Dispatch) {
  var options = {
    excludes: {
      deviceMemory: true,
      enumerateDevices: true,
      screenResolution: true,
      availableScreenResolution: true,
      plugins: true,
      adBlock: true,
      pixelRatio: true,
    },
  };
  Fingerprint2.get(
    {
      preprocessor: function (key, value) {
        if (key == "userAgent") {
          var parser = new UAParser(value); //
          var userAgentMinusVersion =
            parser.getOS().name + " " + parser.getBrowser().name;
          return userAgentMinusVersion;
        }
        return value;
      },
      ...options,
    },
    (components) => {
      const values = components.map((component) => {
        return component.value;
      });
      const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
      dispatcher({
        type: ReducerConstants.FetchFingerPrintAction,
        data: fingerprint,
      });
    }
  );
}

export async function loginUser(
  email: string,
  password: string,
) {
  let request = new LoginRequest.LoginRequest();
  request = LoginRequest.LoginRequest.fromObject({login: email, type: "login", pwd: password, serialNo:""});
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.loginrequest = request;
  const buf = clientMessage.serializeBinary();
  const  converter = ClientMessage.ClientMessage.deserialize(buf);
  console.log(converter,"i am coverted")
  const covertdata =JSON.stringify(buf)
  window.localStorage.setItem("convertedLogindata",covertdata)
  sendMessage(buf, true);
}
