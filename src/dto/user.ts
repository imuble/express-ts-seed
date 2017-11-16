
export default class User {

    username?: string;
    fbId?: string;

    constructor(obj: any) {
        this.username = obj.username;
        this.fbId = obj.fbId;
    }
}