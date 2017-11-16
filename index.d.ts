declare interface ITokenPayload {
    id: string;
    type: string;
    logoutVersion?: number;
}

declare module Express {
    interface Request {
        state: {
            authenticated?: boolean;
            decodedToken?: ITokenPayload;
        }
    }
}

declare module NodeJS {
    interface ProcessEnv {
        APP_PORT:string;API_VERSION:string;DB_URI:string;FB_APP_ID:string;FB_APP_SECRET:string;
    }
}