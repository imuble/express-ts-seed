import UserModel, { IUser } from './model';
import Cache from '../lib/model-cache';

const cache = new Cache<IUser>(100, 5);
const fbCache = new Cache<IUser>(100, 5);

export async function createUser(username: string, password: string): Promise<IUser> {
    const user = new UserModel({
        username: username.toLowerCase(),
        password: password,
    });
    user.password = await user.hashPassword(password);
    return await user.save();
}
export async function createFbUser(fbId: string): Promise<IUser> {
    const user = new UserModel({ fbId: fbId });
    return await user.save();
}

/** TODO: implement cache by username  */
export async function findUserByUsername(username: string, useCache: boolean = true): Promise<IUser | null> {
    const user = await UserModel.findOne({ username: username });
    return user;
}
export async function findUserByFbId(fbId: string, useCache: boolean = true): Promise<IUser | null> {
    if (useCache) {
        const cachedUser = fbCache.get(fbId);
        if (cachedUser) {
            return cachedUser;
        }
    }

    const user = await UserModel.findOne({ fbId: fbId });
    if (user !== null) {
        fbCache.put(user._id, user);
    }
    return user;    
}
export async function findUserById(id: string, useCache: boolean = true): Promise<IUser | null> {

    if (useCache) {
        const cachedUser = cache.get(id);
        if (cachedUser) {
            return cachedUser;
        }
    }

    const user = await UserModel.findById(id);
    if (user !== null) {
        cache.put(user._id, user);
    }
    return user;
}