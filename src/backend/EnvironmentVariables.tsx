let url =window.localStorage.getItem("url")

const websocketUrl = import.meta.env.VITE_WEB_SOCKET_URL || url

const maxReconnectionAttempt = import.meta.env.VITE_MAX_RECONNECTION_ATTEMPT;
const allowInfiniteReconnection = import.meta.env.VITE_ALLOW_INFINITE_RECONNECTION_ATTEMPTS;
const defaultUsername = import.meta.env.VITE_DefaultUsername;
const defaultPassword = import.meta.env.VITE_DefaultPassword;

class EnvVariable {
    webSocketUrl!: string | undefined;
    maxReconnectionAttempt!: number | undefined;
    allowInfiniteReconnection!: boolean | undefined;
    defaultUsername: string | undefined;
    defaultPassword: string | undefined;

    constructor(
        webSocketUrl: string | undefined,
        maxReconnectionAttempt: number | undefined,
        allowInfiniteReconnection: boolean | undefined,
        defaultUsername: string | undefined,
        defaultPassword: string | undefined,) {
        this.webSocketUrl = webSocketUrl;
        this.maxReconnectionAttempt = maxReconnectionAttempt;
        this.allowInfiniteReconnection = allowInfiniteReconnection;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
    }
}

class EnvironmentVariables {
    private static env: EnvironmentVariables;
    variables!: EnvVariable;

    private constructor() {
        this.variables = new EnvVariable(
            websocketUrl,
            parseInt(maxReconnectionAttempt ?? "0"),
            allowInfiniteReconnection == "true",
            defaultUsername,
            defaultPassword,
        );
    }

    public static getInstance(): EnvironmentVariables {
        if (!EnvironmentVariables.env) {
            EnvironmentVariables.env = new EnvironmentVariables();
        }
        return EnvironmentVariables.env;
    }

    getVariable() {
        return this.variables;
    }
}

export { EnvVariable, EnvironmentVariables }